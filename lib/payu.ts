import crypto from "crypto";

/**
 * PayU India — Hash generation & verification
 *
 * Merchant Key: zide1p (public, safe in code)
 * Salt: NEVER in client bundle — only via process.env.PAYU_SALT
 * MID: 13664683
 * Production endpoint: https://secure.payu.in/_payment
 * Test endpoint: https://test.payu.in/_payment
 */

// ─── Types ───────────────────────────────────────────────────

export interface PayUHashParams {
  txnid: string;
  amount: string;
  productinfo: string;
  firstname: string;
  email: string;
  udf1?: string;
  udf2?: string;
  udf3?: string;
  udf4?: string;
  udf5?: string;
}

export interface PayUFormParams extends PayUHashParams {
  key: string;
  hash: string;
  surl: string;
  furl: string;
  phone: string;
  lastname?: string;
}

export interface PayUResponse {
  mihpayid: string;
  status: string;
  txnid: string;
  amount: string;
  productinfo: string;
  firstname: string;
  email: string;
  hash: string;
  udf1?: string;
  udf2?: string;
  udf3?: string;
  udf4?: string;
  udf5?: string;
  [key: string]: string | undefined;
}

// ─── Config ──────────────────────────────────────────────────

function getKey(): string {
  return process.env.PAYU_KEY ?? "zide1p";
}

function getSalt(): string {
  const salt = process.env.PAYU_SALT;
  if (!salt) throw new Error("PAYU_SALT env variable is required");
  return salt;
}

function getMode(): "test" | "production" {
  return (process.env.PAYU_MODE as "test" | "production") ?? "test";
}

export function getPayUEndpoint(): string {
  return getMode() === "production"
    ? "https://secure.payu.in/_payment"
    : "https://test.payu.in/_payment";
}

// ─── Hash generation ─────────────────────────────────────────
// Formula: SHA512(key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||SALT)

export function generateHash(params: PayUHashParams): string {
  const key = getKey();
  const salt = getSalt();

  const hashString = [
    key,
    params.txnid,
    params.amount,
    params.productinfo,
    params.firstname,
    params.email,
    params.udf1 ?? "",
    params.udf2 ?? "",
    params.udf3 ?? "",
    params.udf4 ?? "",
    params.udf5 ?? "",
    "", "", "", "", "", // 5 empty pipes before salt
    salt,
  ].join("|");

  return crypto.createHash("sha512").update(hashString).digest("hex").toLowerCase();
}

// ─── Reverse hash verification ───────────────────────────────
// Formula: SHA512(SALT|status||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key)

export function verifyHash(response: PayUResponse): boolean {
  const salt = getSalt();
  const key = getKey();

  const hashString = [
    salt,
    response.status,
    "", "", "", "", "", // 5 empty pipes after status
    response.udf5 ?? "",
    response.udf4 ?? "",
    response.udf3 ?? "",
    response.udf2 ?? "",
    response.udf1 ?? "",
    response.email,
    response.firstname,
    response.productinfo,
    response.amount,
    response.txnid,
    key,
  ].join("|");

  const computed = crypto.createHash("sha512").update(hashString).digest("hex").toLowerCase();
  return crypto.timingSafeEqual(
    Buffer.from(computed, "hex"),
    Buffer.from((response.hash ?? "").toLowerCase(), "hex")
  );
}

// ─── Build full form params ──────────────────────────────────

export function buildPaymentParams(params: {
  txnid: string;
  amount: number;
  productinfo: string;
  firstname: string;
  lastname?: string;
  email: string;
  phone: string;
  bookingId: string;
  travelDate?: string;
  pax?: string;
  surl: string;
  furl: string;
}): PayUFormParams {
  const hashParams: PayUHashParams = {
    txnid: params.txnid,
    amount: params.amount.toFixed(2),
    productinfo: params.productinfo,
    firstname: params.firstname,
    email: params.email,
    udf1: params.bookingId,
    udf2: params.travelDate ?? "",
    udf3: params.pax ?? "",
    udf4: "",
    udf5: "",
  };

  return {
    key: getKey(),
    ...hashParams,
    hash: generateHash(hashParams),
    surl: params.surl,
    furl: params.furl,
    phone: params.phone,
    lastname: params.lastname ?? "",
  };
}
