// ==================== Order Types ====================

export type OrderType = 'resource' | 'membership';
export type OrderStatus = 'pending' | 'paid' | 'expired' | 'failed';
export type PaymentMethod = 'alipay' | 'wxpay' | 'qqpay';

export interface Order {
  id: string;
  type: OrderType;
  /** Resource ID (only when type is 'resource') */
  resourceId?: string;
  /** Membership type (only when type is 'membership') */
  membershipType?: 'yearly' | 'permanent';
  /** Payment amount in CNY (元) */
  amount: number;
  status: OrderStatus;
  paymentMethod?: PaymentMethod;
  /** Third-party trade number from 易支付 */
  tradeNo?: string;
  createdAt: string;
  paidAt?: string;
  /** Access token generated after payment (resource purchase) */
  accessToken?: string;
  /** Membership token generated after payment (membership purchase) */
  membershipToken?: string;
  /** Client IP */
  clientIp?: string;
}

// ==================== Membership Types ====================

export type MembershipType = 'yearly' | 'permanent';

export interface Membership {
  token: string;
  type: MembershipType;
  startDate: string;
  /** End date (null for permanent) */
  endDate: string | null;
  isActive: boolean;
  orderId: string;
  createdAt: string;
}

// ==================== Resource Types ====================

export interface Resource {
  id: string;
  title: string;
  description: string;
  /** Price in CNY (元) */
  price: number;
  category: string;
  /** Actual download/view link (hidden from public API) */
  link: string;
  coverImage?: string;
  createdAt: string;
  /** Whether this resource is active/available */
  isActive: boolean;
}

/** Public resource info returned by listing API (no link) */
export interface ResourcePublicInfo {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  coverImage?: string;
  createdAt: string;
  isActive: boolean;
}

// ==================== Payment Types ====================

export interface PaymentParams {
  pid: string;
  type: PaymentMethod;
  out_trade_no: string;
  notify_url: string;
  return_url: string;
  name: string;
  money: string;
}

export interface PaymentNotify {
  pid: string;
  trade_no: string;
  out_trade_no: string;
  type: string;
  name: string;
  money: string;
  trade_status: string;
  sign: string;
  sign_type: string;
  param?: string;
}

// ==================== API Types ====================

export interface ApiResponse<T = unknown> {
  code: number;
  msg: string;
  data?: T;
}

export interface CreateOrderRequest {
  type: OrderType;
  resourceId?: string;
  membershipType?: MembershipType;
  paymentMethod?: PaymentMethod;
}

export interface CreateOrderResponse {
  paymentUrl: string;
  orderId: string;
}

export interface OrderStatusResponse {
  orderId: string;
  status: OrderStatus;
  accessToken?: string;
  membershipToken?: string;
}

export interface VerifyAccessResponse {
  valid: boolean;
  resource?: ResourcePublicInfo;
  link?: string;
}

export interface MembershipCheckResponse {
  isActive: boolean;
  type?: MembershipType;
  endDate?: string | null;
}

export interface AdminStatsResponse {
  totalOrders: number;
  paidOrders: number;
  totalRevenue: number;
  totalMemberships: number;
  activeMemberships: number;
  totalResources: number;
  todayOrders: number;
  todayRevenue: number;
}

// ==================== Environment Types ====================

export interface Env {
  PAYMENT_PID: string;
  PAYMENT_KEY: string;
  PAYMENT_GATEWAY: string;
  PAYMENT_NOTIFY_URL: string;
  ADMIN_PASSWORD: string;
  SITE_URL: string;

  ORDERS: KVNamespace;
  MEMBERSHIPS: KVNamespace;
  RESOURCES: KVNamespace;
  ACCESS_TOKENS: KVNamespace;
}
