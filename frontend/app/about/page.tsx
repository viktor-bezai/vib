"use client";

import React from "react";
import { Container, Typography, Button, Box } from "@mui/material";
import Link from "next/link";

export default function AboutPage() {
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
      {/* About Heading */}
      <Typography variant="h3" gutterBottom sx={{ fontWeight: "bold", color: "#1976d2" }}>
        About Me
      </Typography>

      {/* Short Description */}
      <Typography variant="body1" gutterBottom sx={{ marginTop: "1rem" }}>
        Hi, I’m Viktor Bezai, a Full-Stack Software Developer with expertise in building scalable web applications using Python
        (Django/FastAPI) and JavaScript (React/Next.js). With a passion for clean architecture and automation, I love solving
        complex problems and delivering impactful solutions.
      </Typography>

      {/* Resume Download */}
      <Box sx={{ marginTop: "2rem" }}>
        <Link href="/resume/Viktor_Bezai_Software_Developer.pdf" target="_blank" rel="noopener noreferrer">
          <Button variant="contained" color="primary" size="large">
            Download My Resume
          </Button>
        </Link>
      </Box>
    </Container>
  );
}
