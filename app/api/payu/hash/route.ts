import { NextRequest, NextResponse } from "next/server";
import { generatePayUHash, getPayUUrl } from "@/lib/payu";

/**
 * POST /api/payu/hash
 * Generate PayU hash for payment initiation
 * Edge runtime for lowest latency (no Prisma needed here)
 */
export const runtime = "edge";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { txnid, amount, productinfo, firstname, email, udf1, udf2, udf3, udf4, udf5 } = body;

    // Validate required fields
    if (!txnid || !amount || !productinfo || !firstname || !email) {
      return NextResponse.json(
        { error: "Missing required fields: txnid, amount, productinfo, firstname, email" },
        { status: 400 }
      );
    }

    const hash = generatePayUHash({
      txnid,
      amount: String(amount),
      productinfo,
      firstname,
      email,
      udf1: udf1 || "",
      udf2: udf2 || "",
      udf3: udf3 || "",
      udf4: udf4 || "",
      udf5: udf5 || "",
    });

    return NextResponse.json({
      key: process.env.PAYU_KEY || "zide1p",
      hash,
      action: getPayUUrl(),
    });
  } catch (error) {
    console.error("[PayU Hash] Error:", error);
    return NextResponse.json(
      { error: "Failed to generate hash" },
      { status: 500 }
    );
  }
}
