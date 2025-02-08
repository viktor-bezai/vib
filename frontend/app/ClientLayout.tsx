"use client";

import "./globals.css";
import Header from "./components/Layout/Header";
import Providers from "@/app/providers";
import Footer from "@/app/components/Layout/Footer";
import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "@/lib/theme";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <Providers>
        <Header />
        <CssBaseline />
        {children}
        <Footer />
      </Providers>
    </ThemeProvider>
  );
}
