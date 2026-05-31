/**
 * Customer layout — wraps checkout, booking confirmation, my-booking
 * Minimal chrome — no header/footer (checkout focus mode)
 */
export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
