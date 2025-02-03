import "./globals.css";
import Header from "./components/Layout/Header";
import Providers from "@/app/providers";
import Footer from "@/app/components/Layout/Footer";

export default function RootLayout({children}: { children: React.ReactNode }) {
  return (
    <html lang="en">
    <body>
    <Providers>
      <Header/>
      {children}
      <Footer/>
    </Providers>
    </body>
    </html>
  );
}
