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
      <Typography
          variant="h3"
          gutterBottom
          sx={{
            fontWeight: "bold",
            color: "var(--primary-color)",
            fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.8rem" }, // Responsive font size
          }}
        >
          {"Welcome to my personal Web App!"}
      </Typography>

      {/* Subheading */}
      <Typography
      variant="h5"
      gutterBottom
      sx={{
            fontSize: { xs: "1.2rem", sm: "1.5rem", md: "2rem" },
          }}
      >
        {"Hi, I'm Viktor Bezai. "} <br />
          {"Learning English by "}
          <Link href={"/video"}>
            watching videos
          </Link>{" "}
          {"is in development and will be available soon."} <br />
          {"You can download my resume on the "}
          <Link href={"/about"}>
            About page
          </Link>
          {" or connect with me on LinkedIn."}
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
          {"Message Me on LinkedIn"}
        </Button>
      </Box>
    </Container>
  );
}
