import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CampusConnect Dashboard",
  description: "Your student portal",
};

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This layout wraps all pages inside the (authenticated) route group.
  // You can add shared components here like a navigation bar or sidebar
  // specific to logged-in users.
  return <>{children}</>;
}
