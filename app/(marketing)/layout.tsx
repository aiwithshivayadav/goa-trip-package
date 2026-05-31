/**
 * Marketing layout — wraps all customer-facing pages
 * Will contain: Header (sticky, blur) + Footer
 * For now, passes through directly
 */
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* TODO (Phase B Day 2): <Header /> sticky nav with backdrop-blur */}
      <main className="flex-1">{children}</main>
      {/* TODO (Phase B Day 2): <Footer /> 4-column grid */}
    </>
  );
}
