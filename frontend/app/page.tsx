"use client";

import React from "react";
import { Container, Typography, Button, Box, Paper } from "@mui/material";
import Link from "next/link";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

export default function HomePage() {
  return (
    <Container
      maxWidth="md"
      sx={{
        marginTop: "3rem",
        padding: { xs: "1.5rem", sm: "2rem", md: "3rem" },
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: { xs: "1.5rem", sm: "2rem", md: "3rem" },
          textAlign: "center",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Main Heading */}
        <Typography
          variant="h3"
          gutterBottom
          sx={{
            fontWeight: "bold",
            color: "#1976d2",
            fontSize: { xs: "1.2rem", sm: "1.6rem", md: "2rem" },
            marginBottom: "15px"
          }}
        >
          Welcome to My Personal Web App!
        </Typography>

        {/* Subheading */}
        <Typography
          variant="body1"
          gutterBottom
          sx={{
            fontSize: { xs: "1rem", sm: "1rem", md: "1.4rem" },
            marginBottom: "1.5rem",
          }}
        >
          {"Hi, I'm Viktor Bezai."} <br />
          Learning English by{" "}
          <Link href={"/video"} style={{ textDecoration: "none", color: "#1976d2", fontWeight: "bold" }}>
            watching videos
          </Link>{" "}
          is in development and will be available soon.
          <br />
          You can download my resume on the{" "}
          <Link href={"/about"} style={{ textDecoration: "none", color: "#1976d2", fontWeight: "bold" }}>
            About page
          </Link>{" "}
          or connect with me on LinkedIn.
        </Typography>

        {/* Tech Stack Section */}
        <Box
          sx={{
            marginTop: "2rem",
            padding: "1rem",
            backgroundColor: "#f9f9f9",
            borderRadius: "8px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.08)",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333" }}>
            🔧 Built With:
          </Typography>
          <Typography variant="body1" sx={{ color: "#555" }}>
            This web application is developed using{" "}
            <strong>Django</strong> (Backend), <strong>Next.js</strong> (Frontend),{" "}
            <strong>Docker</strong> (Containerization), and <strong>Jenkins</strong> (CI/CD), and it is deployed on a{" "}
            <strong>VPS</strong>.
          </Typography>
        </Box>

        {/* LinkedIn Button */}
        <Box sx={{ marginTop: "2rem" }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<LinkedInIcon />}
            href="https://www.linkedin.com/in/viktor-bezai/"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ maxWidth: "350px", width: "100%" }} // Less wide & centered
          >
            Connect on LinkedIn
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
