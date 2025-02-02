"use client";

import React from "react";
import { Container, Typography, Button, Box, Link } from "@mui/material";

export default function AboutPage() {
  return (
    <Container
      maxWidth="md"
      sx={{
        textAlign: "center",
        marginTop: "3rem",
        padding: "2rem",
        backgroundColor: "#f9f9f9",
        borderRadius: "12px",
        boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Profile Image */}
      <Box
        component="img"
        src="/images/profile.jpeg" // Ensure the image is placed in the public/images folder
        alt="Viktor Bezai"
        sx={{
          width: 150,
          height: 150,
          borderRadius: "50%",
          objectFit: "cover",
          margin: "0 auto 1.5rem",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
        }}
      />

      {/* About Heading */}
      <Typography variant="h3" gutterBottom sx={{ fontWeight: "bold", color: "#1976d2" }}>
        About Me
      </Typography>

      {/* Short Description */}
      <Typography variant="body1" gutterBottom sx={{ marginTop: "1rem", color: "#555" }}>
        Hello! I’m Viktor Bezai, a passionate Full-Stack Software Developer specializing in building scalable web
        applications with Python (Django/FastAPI) and JavaScript (React/Next.js). I thrive on solving complex challenges
        and delivering impactful solutions through clean architecture and automation.
      </Typography>

      {/* LinkedIn */}
      <Typography variant="body1" gutterBottom sx={{ marginTop: "1rem", color: "#555" }}>
        Feel free to connect with me on <Link href="https://www.linkedin.com/in/viktor-bezai/" target="_blank">LinkedIn</Link>.
        I’d be happy to chat and collaborate!
      </Typography>

      {/* Resume Download */}
      <Box sx={{ marginTop: "2rem" }}>
        <Link
          href="/resume/Viktor_Bezai_Software_Developer.pdf"
          target="_blank"
          rel="noopener noreferrer"
          underline="none"
        >
          <Button variant="contained" color="primary" size="large">
            Download My Resume
          </Button>
        </Link>
      </Box>

      {/* Swagger Link */}
      <Typography variant="body1" gutterBottom sx={{ marginTop: "2rem", color: "#555" }}>
        Want to explore the API? Check out the <Link href="/swagger">Swagger documentation</Link> for this website.
      </Typography>
    </Container>
  );
}
