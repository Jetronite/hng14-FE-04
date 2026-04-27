import "./globals.css";
import PwaRegister from "@/components/PwaRegister";

export const metadata = {
  title: "Habit Tracker",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <PwaRegister />
        {children}
      </body>
    </html>
  );
}