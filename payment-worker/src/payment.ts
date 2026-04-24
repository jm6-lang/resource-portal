import type { PaymentParams, PaymentNotify } from './types';

/**
 * MD5 hash function for Cloudflare Workers.
 * Uses the Web Crypto API (SubtleCrypto) which is available in Workers.
 */
async function md5(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest('MD5', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Sort object keys alphabetically and build query string.
 * Excludes 'sign', 'sign_type', and empty values.
 */
function buildSortedQuery(params: Record<string, string>): string {
  const keys = Object.keys(params)
    .filter(key => key !== 'sign' && key !== 'sign_type' && params[key] !== '')
    .sort();

  return keys
    .map(key => `${key}=${params[key]}`)
    .join('&');
}

/**
 * Generate a signed payment URL for redirecting user to the payment gateway.
 *
 * @param params - Payment parameters (pid, type, out_trade_no, notify_url, return_url, name, money)
 * @param key - Merchant secret key
 * @param gateway - Payment gateway base URL (e.g. https://ezfp.cn)
 * @returns Full payment URL with signature
 */
export async function createPaymentUrl(
  params: PaymentParams,
  key: string,
  gateway: string
): Promise<string> {
  const paramsRecord: Record<string, string> = {
    pid: params.pid,
    type: params.type,
    out_trade_no: params.out_trade_no,
    notify_url: params.notify_url,
    return_url: params.return_url,
    name: params.name,
    money: params.money,
  };

  const queryString = buildSortedQuery(paramsRecord);
  const sign = await md5(queryString + key);

  const allParams = new URLSearchParams({
    ...paramsRecord,
    sign,
    sign_type: 'MD5',
  });

  return `${gateway}/submit.php?${allParams.toString()}`;
}

/**
 * Verify the signature of a payment notification callback.
 *
 * @param params - All parameters received from the callback
 * @param key - Merchant secret key
 * @returns Whether the signature is valid
 */
export async function verifyNotify(
  params: PaymentNotify,
  key: string
): Promise<boolean> {
  const paramsRecord: Record<string, string> = { ...params };

  const receivedSign = paramsRecord.sign;
  delete paramsRecord.sign;
  delete paramsRecord.sign_type;

  const queryString = buildSortedQuery(paramsRecord);
  const expectedSign = await md5(queryString + key);

  return receivedSign === expectedSign;
}

/**
 * Generate a unique order ID.
 * Format: SKXM + timestamp (14 digits) + random (6 digits)
 * Example: SKXM20240115120000987654
 */
export function generateOrderId(): string {
  const now = new Date();
  const timestamp = [
    now.getFullYear().toString(),
    (now.getMonth() + 1).toString().padStart(2, '0'),
    now.getDate().toString().padStart(2, '0'),
    now.getHours().toString().padStart(2, '0'),
    now.getMinutes().toString().padStart(2, '0'),
    now.getSeconds().toString().padStart(2, '0'),
  ].join('');

  const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  return `SKXM${timestamp}${random}`;
}

/**
 * Generate a random access token (32 hex characters).
 */
export function generateAccessToken(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
}
