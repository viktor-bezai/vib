import "./globals.css";
import Header from "./components/Layout/Header";
import Providers from "@/app/providers";
import Footer from "@/app/components/Layout/Footer";

export const metadata = {
  title: "Viktor Bezai",
  description: "My personal Web App",
};

export const viewport = {
  themeColor: "#82cfff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
    <head>
      <meta name="theme-color" content="#007FFF" />
    </head>
    <body>
      <Providers>
        <Header />
        {children}
        <Footer />
      </Providers>
    </body>
    </html>
  );
}
