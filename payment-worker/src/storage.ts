import type {
  Order,
  Membership,
  Resource,
  ResourcePublicInfo,
} from './types';

// ==================== KV Key Helpers ====================

const ORDER_KEY = (orderId: string) => `ORDER:${orderId}`;
const MEMBERSHIP_KEY = (token: string) => `MEMBERSHIP:${token}`;
const RESOURCE_KEY = (resourceId: string) => `RESOURCE:${resourceId}`;
const ACCESS_TOKEN_KEY = (resourceId: string, token: string) =>
  `ACCESS:${resourceId}:${token}`;
const RESOURCE_LIST_KEY = 'RESOURCE_LIST';
const ORDER_INDEX_KEY = 'ORDER_INDEX';

// ==================== Order Operations ====================

/**
 * Create a new order in KV storage.
 */
export async function createOrder(
  kv: KVNamespace,
  order: Order
): Promise<void> {
  await kv.put(ORDER_KEY(order.id), JSON.stringify(order), {
    expirationTtl: 60 * 60 * 24 * 90, // 90 days TTL
  });

  // Add to order index for admin listing
  const indexData = await kv.get(ORDER_INDEX_KEY);
  const orderIds: string[] = indexData ? JSON.parse(indexData) : [];
  orderIds.unshift(order.id);
  // Keep only the most recent 1000 orders in index
  if (orderIds.length > 1000) {
    orderIds.length = 1000;
  }
  await kv.put(ORDER_INDEX_KEY, JSON.stringify(orderIds));
}

/**
 * Get an order by ID.
 */
export async function getOrder(
  kv: KVNamespace,
  orderId: string
): Promise<Order | null> {
  const data = await kv.get(ORDER_KEY(orderId));
  if (!data) return null;
  return JSON.parse(data) as Order;
}

/**
 * Update order status.
 */
export async function updateOrderStatus(
  kv: KVNamespace,
  orderId: string,
  status: Order['status'],
  extra?: Partial<Order>
): Promise<Order | null> {
  const order = await getOrder(kv, orderId);
  if (!order) return null;

  order.status = status;
  if (extra) {
    Object.assign(order, extra);
  }
  if (status === 'paid') {
    order.paidAt = new Date().toISOString();
  }

  await kv.put(ORDER_KEY(orderId), JSON.stringify(order), {
    expirationTtl: 60 * 60 * 24 * 90,
  });

  return order;
}

/**
 * List recent order IDs from index.
 */
export async function listOrderIds(
  kv: KVNamespace
): Promise<string[]> {
  const indexData = await kv.get(ORDER_INDEX_KEY);
  if (!indexData) return [];
  return JSON.parse(indexData) as string[];
}

// ==================== Membership Operations ====================

/**
 * Create a new membership record.
 */
export async function createMembership(
  kv: KVNamespace,
  membership: Membership
): Promise<void> {
  const ttl = membership.type === 'permanent'
    ? 60 * 60 * 24 * 365 * 100 // ~100 years for permanent
    : 60 * 60 * 24 * 400; // ~400 days for yearly (with buffer)

  await kv.put(MEMBERSHIP_KEY(membership.token), JSON.stringify(membership), {
    expirationTtl: ttl,
  });
}

/**
 * Get membership by token.
 */
export async function getMembership(
  kv: KVNamespace,
  token: string
): Promise<Membership | null> {
  const data = await kv.get(MEMBERSHIP_KEY(token));
  if (!data) return null;
  return JSON.parse(data) as Membership;
}

/**
 * Check if a membership is currently active.
 * For yearly memberships, checks if endDate is in the future.
 * For permanent memberships, always active unless explicitly deactivated.
 */
export async function getActiveMembership(
  kv: KVNamespace,
  token: string
): Promise<Membership | null> {
  const membership = await getMembership(kv, token);
  if (!membership || !membership.isActive) return null;

  if (membership.endDate) {
    const now = new Date();
    const end = new Date(membership.endDate);
    if (now > end) {
      // Membership expired, update status
      membership.isActive = false;
      await kv.put(MEMBERSHIP_KEY(token), JSON.stringify(membership));
      return null;
    }
  }

  return membership;
}

// ==================== Access Token Operations ====================

/**
 * Create an access token for a purchased resource.
 */
export async function createAccessToken(
  kv: KVNamespace,
  resourceId: string,
  token: string,
  orderId: string
): Promise<void> {
  const data = JSON.stringify({
    orderId,
    resourceId,
    createdAt: new Date().toISOString(),
  });

  await kv.put(ACCESS_TOKEN_KEY(resourceId, token), data, {
    expirationTtl: 60 * 60 * 24 * 365, // 1 year
  });
}

/**
 * Verify an access token for a specific resource.
 * Returns the token data if valid, null otherwise.
 */
export async function verifyAccessToken(
  kv: KVNamespace,
  resourceId: string,
  token: string
): Promise<{ orderId: string; resourceId: string; createdAt: string } | null> {
  const data = await kv.get(ACCESS_TOKEN_KEY(resourceId, token));
  if (!data) return null;
  return JSON.parse(data);
}

// ==================== Resource Operations ====================

/**
 * Get a resource by ID (full data including link).
 */
export async function getResource(
  kv: KVNamespace,
  resourceId: string
): Promise<Resource | null> {
  const data = await kv.get(RESOURCE_KEY(resourceId));
  if (!data) return null;
  return JSON.parse(data) as Resource;
}

/**
 * List all resources (public info only, no links).
 */
export async function listResources(
  kv: KVNamespace
): Promise<ResourcePublicInfo[]> {
  const listData = await kv.get(RESOURCE_LIST_KEY);
  if (!listData) return [];

  const resourceIds: string[] = JSON.parse(listData);
  const resources: ResourcePublicInfo[] = [];

  for (const id of resourceIds) {
    const resource = await getResource(kv, id);
    if (resource && resource.isActive) {
      const { link, ...publicInfo } = resource;
      resources.push(publicInfo);
    }
  }

  return resources;
}

/**
 * Add a resource to the resource list index.
 * Used by admin to register new resources.
 */
export async function addResource(
  kv: KVNamespace,
  resource: Resource
): Promise<void> {
  await kv.put(RESOURCE_KEY(resource.id), JSON.stringify(resource));

  const listData = await kv.get(RESOURCE_LIST_KEY);
  const resourceIds: string[] = listData ? JSON.parse(listData) : [];

  if (!resourceIds.includes(resource.id)) {
    resourceIds.push(resource.id);
    await kv.put(RESOURCE_LIST_KEY, JSON.stringify(resourceIds));
  }
}

/**
 * Get all orders (for admin stats).
 * Reads from the order index and fetches each order.
 */
export async function getAllOrders(
  kv: KVNamespace,
  limit: number = 100
): Promise<Order[]> {
  const orderIds = await listOrderIds(kv);
  const orders: Order[] = [];

  const idsToFetch = orderIds.slice(0, limit);

  for (const id of idsToFetch) {
    const order = await getOrder(kv, id);
    if (order) {
      orders.push(order);
    }
  }

  return orders;
}

/**
 * Get all memberships (for admin stats).
 */
export async function getAllMemberships(
  kv: KVNamespace
): Promise<Membership[]> {
  const list = await kv.list({ prefix: 'MEMBERSHIP:' });
  const memberships: Membership[] = [];

  for (const key of list.keys) {
    const data = await kv.get(key.name);
    if (data) {
      memberships.push(JSON.parse(data) as Membership);
    }
  }

  return memberships;
}
