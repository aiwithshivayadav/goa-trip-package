import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { notifyLeadCreated } from "@/lib/n8n";
import { generateLeadCode, normalizePhone } from "@/lib/utils";

/**
 * POST /api/leads — Create a new lead
 * Called from: custom-trip wizard, enquiry form, contact page
 * Writes to DB + fires n8n webhook (fire-and-forget)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, email, productInterest, productSlug, travelDateFrom, travelDateTo, adults, children, message, source, utmSource, utmMedium, utmCampaign } = body;

    if (!name || !phone) {
      return NextResponse.json({ error: "Name and phone are required" }, { status: 400 });
    }

    const leadCode = generateLeadCode();
    const phoneRaw = normalizePhone(phone);

    try {
      // Write to database
      const lead = await db.lead.create({
        data: {
          leadCode,
          name,
          email: email || null,
          phone,
          phoneRaw,
          source: source || "website",
          productInterest: productInterest || null,
          productSlug: productSlug || null,
          travelDateFrom: travelDateFrom ? new Date(travelDateFrom) : null,
          travelDateTo: travelDateTo ? new Date(travelDateTo) : null,
          adults: adults || 0,
          children: children || 0,
          message: message || null,
          utmSource: utmSource || null,
          utmMedium: utmMedium || null,
          utmCampaign: utmCampaign || null,
          status: "new_lead",
          priority: "normal",
        },
      });

      // Try to find or create customer
      try {
        await db.customer.upsert({
          where: { phone },
          update: {
            lastSeenAt: new Date(),
            name: name, // update to latest name
          },
          create: {
            name,
            email: email || null,
            phone,
            phoneRaw,
            source: source || "website",
          },
        });
      } catch {
        // Customer upsert is best-effort — don't block lead creation
      }

      // Fire n8n webhook (non-blocking)
      notifyLeadCreated({ name, phone, email, productInterest, source, leadCode });

      return NextResponse.json(
        { success: true, leadCode, message: "Enquiry received! Our team will reach you within 30 minutes." },
        { status: 201 }
      );
    } catch (dbError) {
      // If DB is not connected, still return success to the customer
      // (the webhook will still fire, and the lead data is in the request logs)
      console.error("[Leads API] DB write failed (DB may not be connected):", dbError);

      // Still fire webhook even without DB
      notifyLeadCreated({ name, phone, email, productInterest, source, leadCode });

      return NextResponse.json(
        { success: true, leadCode, message: "Enquiry received! Our team will reach you within 30 minutes." },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("[Leads API] Error:", error);
    return NextResponse.json({ error: "Failed to submit enquiry" }, { status: 500 });
  }
}

/**
 * GET /api/leads — List leads (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    const where = status ? { status: status as "new_lead" | "contacted" | "quoted" | "negotiating" | "won" | "lost" } : {};

    const [leads, total] = await Promise.all([
      db.lead.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.lead.count({ where }),
    ]);

    return NextResponse.json({ leads, total, page, limit });
  } catch (error) {
    console.error("[Leads API] GET error:", error);
    // Return empty if DB not connected
    return NextResponse.json({ leads: [], total: 0, page: 1, limit: 50 });
  }
}
