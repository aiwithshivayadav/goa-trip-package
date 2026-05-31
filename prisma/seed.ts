import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ── Admin user ──
  const adminPassword = await bcrypt.hash("GTPAdmin@2026", 12);
  const admin = await prisma.salesUser.upsert({
    where: { username: "gtpadmin" },
    update: {},
    create: {
      username: "gtpadmin",
      passwordHash: adminPassword,
      name: "Shiva",
      email: "info@goatrippackage.com",
      phone: "+919890830249",
      role: "admin",
      commissionPct: 0,
      isActive: true,
    },
  });
  console.log(`✅ Admin user: ${admin.username} (ID: ${admin.id})`);

  // ── Sales user ──
  const salesPassword = await bcrypt.hash("GTPSales@2026", 12);
  const sales = await prisma.salesUser.upsert({
    where: { username: "riya" },
    update: {},
    create: {
      username: "riya",
      passwordHash: salesPassword,
      name: "Riya",
      email: "sales@goatrippackage.com",
      role: "sales",
      commissionPct: 5,
      isActive: true,
    },
  });
  console.log(`✅ Sales user: ${sales.username} (ID: ${sales.id})`);

  // ── Default settings ──
  const settings = [
    { key: "payu_mode", value: "test" },
    { key: "gst_rate_packages", value: "5" },
    { key: "gst_rate_activities", value: "18" },
    { key: "gst_rate_yachts", value: "18" },
    { key: "gst_included", value: "true" },
    { key: "advance_percent", value: "25" },
    { key: "brand_name", value: "Goa Trip Package" },
    { key: "brand_tagline", value: "Your Royal Goa Experience" },
    { key: "brand_phone", value: "+919890830249" },
    { key: "brand_email", value: "info@goatrippackage.com" },
    { key: "brand_whatsapp", value: "919890830249" },
  ];

  for (const s of settings) {
    await prisma.settings.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: { key: s.key, value: s.value },
    });
  }
  console.log(`✅ ${settings.length} settings configured`);

  // ── Sample coupons ──
  const coupons = [
    { code: "GOAFIRST", type: "flat" as const, value: 500, maxUses: 100, validFrom: new Date(), validTo: new Date("2026-06-30") },
    { code: "MONSOON26", type: "percent" as const, value: 15, maxUses: 200, maxDiscount: 2000, validFrom: new Date(), validTo: new Date("2026-08-31") },
    { code: "GROUP10", type: "percent" as const, value: 10, maxUses: 50, maxDiscount: 5000, validFrom: new Date(), validTo: new Date("2026-12-31") },
  ];

  for (const c of coupons) {
    await prisma.coupon.upsert({
      where: { code: c.code },
      update: {},
      create: {
        code: c.code,
        type: c.type,
        value: c.value,
        maxUses: c.maxUses,
        maxDiscount: c.maxDiscount ?? null,
        validFrom: c.validFrom,
        validTo: c.validTo,
        isActive: true,
      },
    });
  }
  console.log(`✅ ${coupons.length} coupons created`);

  console.log("\n🎉 Seed complete!");
  console.log("\nAdmin login:");
  console.log("  Username: gtpadmin");
  console.log("  Password: GTPAdmin@2026");
  console.log("\nSales login:");
  console.log("  Username: riya");
  console.log("  Password: GTPSales@2026");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
