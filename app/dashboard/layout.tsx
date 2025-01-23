import type { Metadata } from "next";
import ProtectedRoute from "@/components/appComp/ProtectedRoute";
import { TrackedWalletsProvider } from "@/context/TrackedWalletsContext";

export const metadata: Metadata = {
  title: "walletwit: Your account analytics",
  description:
    "Your account analytics, built with Next.js, TypeScript, and Tailwind CSS.",
  icons: {
    icon: "/icon.png",
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TrackedWalletsProvider>
      <ProtectedRoute>{children}</ProtectedRoute>
    </TrackedWalletsProvider>
  );
}
