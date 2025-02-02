import "./globals.css";
import Header from "./components/Layout/Header";
import Providers from "@/app/providers";

export default function RootLayout({children}: { children: React.ReactNode }) {
  return (
    <html lang="en">
    <body>
    <Providers>
      <Header/>
      {children}
    </Providers>
    </body>
    </html>
  );
}
