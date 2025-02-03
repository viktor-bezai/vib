"use client";

import React from "react";
import { AppBar, Toolbar, Typography, Box, Container } from "@mui/material";
import Link from "next/link";

export default function Footer() {
  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "var(--primary-color)",
        padding: "1rem 0",
        boxShadow: "0 -4px 8px var(--shadow-color)",
        marginTop: "auto",
      }}
    >
      <Container>
        <Toolbar sx={{ flexDirection: "column", alignItems: "center" }}>
          <Box sx={{ display: "flex", gap: "1rem", marginBottom: "0.5rem" }}>
            <Link href="https://www.linkedin.com/in/viktor-bezai/" style={{ textDecoration: "none", color: "var(--button-text-color)" }}>
              <Typography
                variant="body1"
                sx={{
                  transition: "0.3s",
                  "&:hover": {
                    textShadow: "0 0 8px white",
                  },
                }}
              >
                LinkedIn
              </Typography>
            </Link>
            <Typography variant="body1" sx={{ color: "var(--button-text-color)" }}>|</Typography>
            <Link href="https://www.facebook.com/viktorbezai" style={{ textDecoration: "none", color: "var(--button-text-color)" }}>
              <Typography
                variant="body1"
                sx={{
                  transition: "0.3s",
                  "&:hover": {
                    textShadow: "0 0 8px white",
                  },
                }}
              >
                Facebook
              </Typography>
            </Link>
          </Box>
          <Typography variant="body2" color="var(--button-text-color)">
            © {new Date().getFullYear()} Learn English App. All rights reserved.
          </Typography>
        </Toolbar>
      </Container>
    </AppBar>
  );
}