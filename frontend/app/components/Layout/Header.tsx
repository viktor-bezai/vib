"use client";

import React from "react";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import Link from "next/link";

export default function Header() {
  return (
    <AppBar position="static" sx={{ backgroundColor: "#1976d2", padding: "0.5rem 0" }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* App Logo */}
        <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
          <Typography variant="h5" component="div" sx={{ fontWeight: "bold" }}>
            Learn English App
          </Typography>
        </Link>

        {/* Navigation Links */}
        <Box sx={{ display: "flex", gap: "1.5rem" }}>
          <Link href="/video" style={{ textDecoration: "none", color: "inherit" }}>
            <Typography
              variant="subtitle1"
              sx={{
                "&:hover": { textDecoration: "underline", color: "#ffca28" },
                fontWeight: 500,
              }}
            >
              Learn by Videos
            </Typography>
          </Link>
          <Link href="/about" style={{ textDecoration: "none", color: "inherit" }}>
            <Typography
              variant="subtitle1"
              sx={{
                "&:hover": { textDecoration: "underline", color: "#ffca28" },
                fontWeight: 500,
              }}
            >
              About Me
            </Typography>
          </Link>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
