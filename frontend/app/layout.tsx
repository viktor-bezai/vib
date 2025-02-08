import ClientLayout from "./ClientLayout"; // ✅ Import the client layout

export const metadata = {
  title: "Viktor Bezai",
  description: "My personal Web App",
};

export const viewport = {
  themeColor: "#5db1ff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
