"use client";

import React from "react";
import { Container, Typography, Button, Box } from "@mui/material";
import Link from "next/link";

export default function HomePage() {
  return (
    <Container
      maxWidth="md"
      sx={{
        textAlign: "center",
        marginTop: "3rem",
        padding: "2rem",
        backgroundColor: "#f5f5f5",
        borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Main Heading */}
      <Typography variant="h3" gutterBottom sx={{ fontWeight: "bold", color: "var(--primary-color)" }}>
        Welcome to Learn English App!
      </Typography>

      {/* Subheading */}
      <Typography variant="h5" gutterBottom >
        Enjoy learning English by watching videos with words you chose.
      </Typography>

      {/* Message about LinkedIn */}
      <Typography variant="h6" gutterBottom sx={{ marginTop: "1rem" }}>
        If you'd like to chat, feel free to connect with me on LinkedIn.
      </Typography>

      {/* LinkedIn Button */}
      <Box sx={{ marginTop: "1.5rem" }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          href="https://www.linkedin.com/in/viktor-bezai/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Message Me on LinkedIn
        </Button>
      </Box>
    </Container>
  );
}
