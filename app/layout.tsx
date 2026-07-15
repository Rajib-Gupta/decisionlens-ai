import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "DecisionLens AI",
  description: "Decision intelligence for consequential choices",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
