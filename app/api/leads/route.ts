import { NextRequest, NextResponse } from "next/server";
// import { db } from "@/lib/db";
// import { notifyLeadCreated } from "@/lib/n8n";
// import { generateLeadCode, normalizePhone } from "@/lib/utils";

/**
 * POST /api/leads — Create a new lead (from custom-trip form, enquiry buttons, etc.)
 * GET /api/leads — List leads (admin only)
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { name, phone, email, productInterest, travelDateFrom, travelDateTo, adults, children, message, source, utmSource, utmMedium, utmCampaign } = body;

    // Validate required fields
    if (!name || !phone) {
      return NextResponse.json(
        { error: "Name and phone are required" },
        { status: 400 }
      );
    }

    // TODO (Phase E): Write to DB + fire n8n webhook
    // const leadCode = generateLeadCode();
    // const phoneRaw = normalizePhone(phone);
    //
    // const lead = await db.lead.create({
    //   data: {
    //     leadCode,
    //     name,
    //     email: email || null,
    //     phone,
    //     phoneRaw,
    //     source: source || "website",
    //     productInterest,
    //     travelDateFrom: travelDateFrom ? new Date(travelDateFrom) : null,
    //     travelDateTo: travelDateTo ? new Date(travelDateTo) : null,
    //     adults: adults || 0,
    //     children: children || 0,
    //     message,
    //     utmSource,
    //     utmMedium,
    //     utmCampaign,
    //   },
    // });
    //
    // // Fire-and-forget n8n notification
    // notifyLeadCreated({ name, phone, email, productInterest, source, leadCode });

    return NextResponse.json(
      { success: true, message: "Enquiry received! Our team will reach you within 30 minutes." },
      { status: 201 }
    );
  } catch (error) {
    console.error("[Leads API] Error:", error);
    return NextResponse.json(
      { error: "Failed to submit enquiry" },
      { status: 500 }
    );
  }
}

export async function GET() {
  // TODO (Phase E): Return paginated leads for admin
  return NextResponse.json({ leads: [], total: 0 });
}
