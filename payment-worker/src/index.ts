import type { Env, ApiResponse, CreateOrderRequest, PaymentNotify, AdminStatsResponse } from './types';
import { createPaymentUrl, verifyNotify, generateOrderId, generateAccessToken } from './payment';
import {
  createOrder,
  getOrder,
  updateOrderStatus,
  createMembership,
  getActiveMembership,
  createAccessToken as storeAccessToken,
  verifyAccessToken,
  getResource,
  listResources,
  getAllOrders,
  getAllMemberships,
} from './storage';

// ==================== CORS Headers ====================

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': 'https://docs.skillxm.cn',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// ==================== Rate Limiter ====================

/**
 * Simple in-memory rate limiter.
 * Limits order creation to 1 request per second per IP.
 * Note: This is per-Worker-instance; in production with multiple instances,
 * consider using Durable Objects or a KV-based approach for distributed rate limiting.
 */
const rateLimitMap = new Map<string, number>();
const RATE_LIMIT_WINDOW_MS = 1000; // 1 second

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const lastRequest = rateLimitMap.get(ip);
  if (lastRequest && now - lastRequest < RATE_LIMIT_WINDOW_MS) {
    return true;
  }
  rateLimitMap.set(ip, now);

  // Cleanup old entries periodically (every 100 requests)
  if (rateLimitMap.size > 100) {
    const cutoff = now - RATE_LIMIT_WINDOW_MS * 10;
    for (const [key, time] of rateLimitMap.entries()) {
      if (time < cutoff) {
        rateLimitMap.delete(key);
      }
    }
  }

  return false;
}

// ==================== Helpers ====================

function jsonResponse<T>(data: T, status: number = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...CORS_HEADERS,
    },
  });
}

function successResponse<T>(data?: T): Response {
  return jsonResponse<ApiResponse<T>>({ code: 0, msg: 'success', data });
}

function errorResponse(msg: string, code: number = -1, status: number = 400): Response {
  return jsonResponse<ApiResponse>({ code, msg }, status);
}

function getClientIp(request: Request): string {
  return request.headers.get('CF-Connecting-IP') || 'unknown';
}

/**
 * Parse URL query parameters into a flat string->string record.
 */
function parseQueryParams(url: string): Record<string, string> {
  const params = new URL(url).searchParams;
  const result: Record<string, string> = {};
  for (const [key, value] of params.entries()) {
    result[key] = value;
  }
  return result;
}

/**
 * Parse form-encoded body into a flat string->string record.
 */
async function parseFormData(request: Request): Promise<Record<string, string>> {
  const formData = await request.formData();
  const result: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    result[key] = value as string;
  }
  return result;
}

// ==================== Membership Pricing ====================

const MEMBERSHIP_PRICES: Record<string, number> = {
  yearly: 79,
  permanent: 69,
};

const MEMBERSHIP_NAMES: Record<string, string> = {
  yearly: '年度会员',
  permanent: '永久会员',
};

// ==================== Route Handlers ====================

/**
 * GET /api/health - Health check endpoint
 */
function handleHealth(): Response {
  return successResponse({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
}

/**
 * POST /api/create-order - Create a new payment order
 */
async function handleCreateOrder(
  request: Request,
  env: Env
): Promise<Response> {
  // Rate limiting
  const clientIp = getClientIp(request);
  if (isRateLimited(clientIp)) {
    return errorResponse('请求过于频繁，请稍后再试', -2, 429);
  }

  // Parse request body
  let body: CreateOrderRequest;
  try {
    body = await request.json() as CreateOrderRequest;
  } catch {
    return errorResponse('无效的请求格式');
  }

  const { type, resourceId, membershipType, paymentMethod = 'alipay' } = body;

  // Validate order type
  if (type !== 'resource' && type !== 'membership') {
    return errorResponse('无效的订单类型');
  }

  let amount: number;
  let orderName: string;

  if (type === 'resource') {
    if (!resourceId) {
      return errorResponse('缺少资源ID');
    }

    // Look up resource
    const resource = await getResource(env.RESOURCES, resourceId);
    if (!resource) {
      return errorResponse('资源不存在');
    }
    if (!resource.isActive) {
      return errorResponse('该资源已下架');
    }

    amount = resource.price;
    orderName = `购买资源: ${resource.title}`;
  } else {
    if (!membershipType || !MEMBERSHIP_PRICES[membershipType]) {
      return errorResponse('无效的会员类型');
    }

    amount = MEMBERSHIP_PRICES[membershipType];
    orderName = `购买${MEMBERSHIP_NAMES[membershipType]}`;
  }

  // Generate order
  const orderId = generateOrderId();
  const gateway = env.PAYMENT_GATEWAY || 'https://ezfp.cn';
  const returnUrl = `${env.SITE_URL}/payment/callback`;

  const order = {
    id: orderId,
    type,
    resourceId: type === 'resource' ? resourceId : undefined,
    membershipType: type === 'membership' ? membershipType : undefined,
    amount,
    status: 'pending' as const,
    paymentMethod,
    createdAt: new Date().toISOString(),
    clientIp,
  };

  // Store order in KV
  await createOrder(env.ORDERS, order);

  // Generate signed payment URL
  const paymentUrl = await createPaymentUrl(
    {
      pid: env.PAYMENT_PID,
      type: paymentMethod,
      out_trade_no: orderId,
      notify_url: env.PAYMENT_NOTIFY_URL,
      return_url: returnUrl,
      name: orderName,
      money: amount.toFixed(2),
    },
    env.PAYMENT_KEY,
    gateway
  );

  return successResponse({
    paymentUrl,
    orderId,
  });
}

/**
 * GET /api/order-status?orderId=xxx - Check order status
 */
async function handleOrderStatus(
  request: Request,
  env: Env
): Promise<Response> {
  const url = new URL(request.url);
  const orderId = url.searchParams.get('orderId');

  if (!orderId) {
    return errorResponse('缺少订单ID');
  }

  const order = await getOrder(env.ORDERS, orderId);
  if (!order) {
    return errorResponse('订单不存在', -1, 404);
  }

  return successResponse({
    orderId: order.id,
    status: order.status,
    accessToken: order.accessToken,
    membershipToken: order.membershipToken,
  });
}

/**
 * GET /api/verify-access?resourceId=xxx&token=xxx - Verify access token
 */
async function handleVerifyAccess(
  request: Request,
  env: Env
): Promise<Response> {
  const url = new URL(request.url);
  const resourceId = url.searchParams.get('resourceId');
  const token = url.searchParams.get('token');

  if (!resourceId || !token) {
    return errorResponse('缺少必要参数');
  }

  // First check if user has an active membership (members can access all resources)
  const membership = await getActiveMembership(env.MEMBERSHIPS, token);
  if (membership) {
    const resource = await getResource(env.RESOURCES, resourceId);
    if (!resource) {
      return errorResponse('资源不存在', -1, 404);
    }
    return successResponse({
      valid: true,
      resource: {
        id: resource.id,
        title: resource.title,
        description: resource.description,
        price: resource.price,
        category: resource.category,
        coverImage: resource.coverImage,
        createdAt: resource.createdAt,
        isActive: resource.isActive,
      },
      link: resource.link,
      accessType: 'membership',
    });
  }

  // Check resource-specific access token
  const tokenData = await verifyAccessToken(env.ACCESS_TOKENS, resourceId, token);
  if (!tokenData) {
    return successResponse({ valid: false });
  }

  const resource = await getResource(env.RESOURCES, resourceId);
  if (!resource) {
    return errorResponse('资源不存在', -1, 404);
  }

  return successResponse({
    valid: true,
    resource: {
      id: resource.id,
      title: resource.title,
      description: resource.description,
      price: resource.price,
      category: resource.category,
      coverImage: resource.coverImage,
      createdAt: resource.createdAt,
      isActive: resource.isActive,
    },
    link: resource.link,
    accessType: 'token',
  });
}

/**
 * POST /api/notify - Payment callback from 易支付
 *
 * This endpoint receives async payment notifications from the payment gateway.
 * It verifies the signature and updates the order status accordingly.
 */
async function handleNotify(
  request: Request,
  env: Env
): Promise<Response> {
  // Parse the notification parameters (form-encoded)
  const params = await parseFormData(request);

  const notify: PaymentNotify = {
    pid: params.pid || '',
    trade_no: params.trade_no || '',
    out_trade_no: params.out_trade_no || '',
    type: params.type || '',
    name: params.name || '',
    money: params.money || '',
    trade_status: params.trade_status || '',
    sign: params.sign || '',
    sign_type: params.sign_type || '',
    param: params.param || undefined,
  };

  // Verify the payment signature
  const isValid = await verifyNotify(notify, env.PAYMENT_KEY);
  if (!isValid) {
    // Signature verification failed
    return new Response('fail', { status: 400 });
  }

  // Verify merchant ID matches
  if (notify.pid !== env.PAYMENT_PID) {
    return new Response('fail', { status: 400 });
  }

  // Check trade status (易支付 uses "TRADE_SUCCESS" for successful payments)
  if (notify.trade_status !== 'TRADE_SUCCESS') {
    return new Response('success'); // Acknowledge but don't process
  }

  // Get the order
  const order = await getOrder(env.ORDERS, notify.out_trade_no);
  if (!order) {
    return new Response('fail', { status: 400 });
  }

  // Prevent duplicate processing
  if (order.status === 'paid') {
    return new Response('success');
  }

  // Update order status
  const updatedOrder = await updateOrderStatus(
    env.ORDERS,
    order.id,
    'paid',
    {
      tradeNo: notify.trade_no,
      paymentMethod: notify.type as any,
    }
  );

  if (!updatedOrder) {
    return new Response('fail', { status: 500 });
  }

  // Process based on order type
  if (order.type === 'resource' && order.resourceId) {
    // Generate access token for the purchased resource
    const accessToken = generateAccessToken();
    await storeAccessToken(env.ACCESS_TOKENS, order.resourceId, accessToken, order.id);

    // Update order with access token
    await updateOrderStatus(env.ORDERS, order.id, 'paid', { accessToken });
  } else if (order.type === 'membership' && order.membershipType) {
    // Create membership record
    const membershipToken = generateAccessToken();
    const now = new Date();
    const endDate = order.membershipType === 'yearly'
      ? new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString()
      : null;

    await createMembership(env.MEMBERSHIPS, {
      token: membershipToken,
      type: order.membershipType,
      startDate: now.toISOString(),
      endDate,
      isActive: true,
      orderId: order.id,
      createdAt: now.toISOString(),
    });

    // Update order with membership token
    await updateOrderStatus(env.ORDERS, order.id, 'paid', { membershipToken });
  }

  return new Response('success');
}

/**
 * GET /api/resources - List all paid resources (public info only)
 */
async function handleListResources(env: Env): Promise<Response> {
  const resources = await listResources(env.RESOURCES);
  return successResponse(resources);
}

/**
 * GET /api/membership/check?token=xxx - Check membership status
 */
async function handleMembershipCheck(
  request: Request,
  env: Env
): Promise<Response> {
  const url = new URL(request.url);
  const token = url.searchParams.get('token');

  if (!token) {
    return errorResponse('缺少会员令牌');
  }

  const membership = await getActiveMembership(env.MEMBERSHIPS, token);
  if (!membership) {
    return successResponse({
      isActive: false,
    });
  }

  return successResponse({
    isActive: true,
    type: membership.type,
    endDate: membership.endDate,
    startDate: membership.startDate,
  });
}

// ==================== Admin Routes ====================

/**
 * Simple admin authentication check.
 * Admin token is passed via Authorization header or query parameter.
 */
function verifyAdmin(request: Request, env: Env): boolean {
  const authHeader = request.headers.get('Authorization');
  const url = new URL(request.url);
  const queryToken = url.searchParams.get('admin_token');

  const token = authHeader?.replace('Bearer ', '') || queryToken;

  if (!token) return false;

  // Simple password-based auth
  return token === env.ADMIN_PASSWORD;
}

/**
 * POST /api/admin/login - Admin login
 */
async function handleAdminLogin(
  request: Request,
  env: Env
): Promise<Response> {
  let body: { password?: string };
  try {
    body = await request.json() as { password?: string };
  } catch {
    return errorResponse('无效的请求格式');
  }

  if (!body.password) {
    return errorResponse('请输入密码');
  }

  if (body.password !== env.ADMIN_PASSWORD) {
    return errorResponse('密码错误', -1, 401);
  }

  return successResponse({
    token: env.ADMIN_PASSWORD,
  });
}

/**
 * GET /api/admin/orders - List all orders (admin only)
 */
async function handleAdminOrders(
  request: Request,
  env: Env
): Promise<Response> {
  if (!verifyAdmin(request, env)) {
    return errorResponse('未授权', -1, 401);
  }

  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const limit = Math.min(parseInt(url.searchParams.get('limit') || '50', 10), 200);

  const orders = await getAllOrders(env.ORDERS, limit);
  return successResponse({
    orders,
    total: orders.length,
    page,
    limit,
  });
}

/**
 * GET /api/admin/stats - Dashboard statistics (admin only)
 */
async function handleAdminStats(
  request: Request,
  env: Env
): Promise<Response> {
  if (!verifyAdmin(request, env)) {
    return errorResponse('未授权', -1, 401);
  }

  const orders = await getAllOrders(env.ORDERS, 1000);
  const memberships = await getAllMemberships(env.MEMBERSHIPS);

  const paidOrders = orders.filter(o => o.status === 'paid');
  const totalRevenue = paidOrders.reduce((sum, o) => sum + o.amount, 0);

  const today = new Date().toISOString().slice(0, 10);
  const todayOrders = orders.filter(o => o.createdAt.slice(0, 10) === today);
  const todayPaidOrders = todayOrders.filter(o => o.status === 'paid');
  const todayRevenue = todayPaidOrders.reduce((sum, o) => sum + o.amount, 0);

  const activeMemberships = memberships.filter(m => m.isActive);

  const stats: AdminStatsResponse = {
    totalOrders: orders.length,
    paidOrders: paidOrders.length,
    totalRevenue,
    totalMemberships: memberships.length,
    activeMemberships: activeMemberships.length,
    totalResources: (await listResources(env.RESOURCES)).length,
    todayOrders: todayOrders.length,
    todayRevenue,
  };

  return successResponse(stats);
}

// ==================== Main Router ====================

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const { pathname } = url;
    const method = request.method;

    // Handle CORS preflight
    if (method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: CORS_HEADERS,
      });
    }

    try {
      // Route matching
      if (pathname === '/api/health' && method === 'GET') {
        return handleHealth();
      }

      if (pathname === '/api/create-order' && method === 'POST') {
        return handleCreateOrder(request, env);
      }

      if (pathname === '/api/order-status' && method === 'GET') {
        return handleOrderStatus(request, env);
      }

      if (pathname === '/api/verify-access' && method === 'GET') {
        return handleVerifyAccess(request, env);
      }

      if (pathname === '/api/notify' && method === 'POST') {
        return handleNotify(request, env);
      }

      if (pathname === '/api/resources' && method === 'GET') {
        return handleListResources(env);
      }

      if (pathname === '/api/membership/check' && method === 'GET') {
        return handleMembershipCheck(request, env);
      }

      // Admin routes
      if (pathname === '/api/admin/login' && method === 'POST') {
        return handleAdminLogin(request, env);
      }

      if (pathname === '/api/admin/orders' && method === 'GET') {
        return handleAdminOrders(request, env);
      }

      if (pathname === '/api/admin/stats' && method === 'GET') {
        return handleAdminStats(request, env);
      }

      // 404 for unmatched routes
      return errorResponse('接口不存在', -1, 404);

    } catch (error) {
      // Global error handler
      console.error('Worker error:', error);
      return errorResponse('服务器内部错误', -1, 500);
    }
  },
};
