import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/api-auth";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const rows = await db.settings.findMany();
    const settings: Record<string, string | null> = {};
    for (const row of rows) {
      settings[row.key] = row.value;
    }

    const envStatus = {
      payu_key: !!process.env.PAYU_KEY,
      payu_salt: !!process.env.PAYU_SALT,
      payu_mode: process.env.PAYU_MODE || "test",
      smtp_host: process.env.SMTP_HOST || "",
      smtp_port: process.env.SMTP_PORT || "",
      smtp_user: process.env.SMTP_USER || "",
      smtp_pass_set: !!process.env.SMTP_PASS,
      database_connected: true,
    };

    return NextResponse.json({ settings, envStatus });
  } catch (error) {
    console.error("[Settings API] GET error:", error);
    return NextResponse.json({ error: "Failed to load settings" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const body = await request.json();
    const { settings } = body as { settings: Record<string, string> };

    if (!settings || typeof settings !== "object") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const allowedKeys = [
      "business_name",
      "business_tagline",
      "support_phone",
      "support_email",
      "gstin",
      "gst_rate_default",
      "gst_rate_hotel_low",
      "gst_rate_hotel_high",
      "whatsapp_provider",
      "whatsapp_template_booking",
      "whatsapp_template_quote",
    ];

    const updates = Object.entries(settings).filter(([key]) =>
      allowedKeys.includes(key)
    );

    await Promise.all(
      updates.map(([key, value]) =>
        db.settings.upsert({
          where: { key },
          create: { key, value: String(value) },
          update: { value: String(value) },
        })
      )
    );

    return NextResponse.json({ success: true, updated: updates.length });
  } catch (error) {
    console.error("[Settings API] PATCH error:", error);
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
