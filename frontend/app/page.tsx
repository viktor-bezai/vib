"use client";

import React from "react";
import {Box, Button, Container, Paper, Typography} from "@mui/material";
import Link from "next/link";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

export default function HomePage() {
  return (
    <Container
      maxWidth="md"
      sx={{
        marginTop: "3rem",
        padding: {xs: "1.5rem", sm: "2rem", md: "3rem"},
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: {xs: "1.5rem", sm: "2rem", md: "3rem"},
          textAlign: "center",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Introduction */}
        <Typography variant="body1" gutterBottom
                    sx={{fontSize: {xs: "1rem", sm: "1rem", md: "1.4rem"}, marginBottom: "1.5rem"}}>
          {`Hi, I'm Viktor Bezai.`}
          <br/>
          {`Welcome to my personal web application.`}
        </Typography>

        <Typography variant="body1" sx={{fontSize: {xs: "1rem", sm: "1rem", md: "1.2rem"}}}>
          Check out the{" "}
          <Link href="/about" style={{textDecoration: "none", color: "#1976d2", fontWeight: "bold"}}>
            {`about page`}
          </Link>{" "}
          {`to download my resume or connect with me on LinkedIn.`}
        </Typography>

        <Typography variant="body1" sx={{fontSize: {xs: "1rem", sm: "1rem", md: "1.2rem"}, marginTop: "1rem"}}>
          {`If you're not a native English speaker and want to expand your vocabulary, check out `}
          <Link href="/video" style={{textDecoration: "none", color: "#1976d2", fontWeight: "bold"}}>
            video page
          </Link>{" "}
          {`to hear how words are pronounced in real-world conversations.`}
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
          <Typography variant="h6" sx={{fontWeight: "bold", color: "#333"}}>
            {`🔧 Built With:`}
          </Typography>
          <Typography variant="body1" sx={{color: "#555"}}>
            This web application is developed
            using <strong>Django</strong> (Backend), <strong>Next.js</strong> (Frontend),{" "}
            <strong>Docker</strong> (Containerization), and <strong>Jenkins</strong> (CI/CD). It is deployed on a{" "}
            <strong>VPS</strong> using <strong>Nginx</strong> as the reverse proxy.
          </Typography>
        </Box>

        {/* LinkedIn Button */}
        <Box sx={{marginTop: "2rem"}}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<LinkedInIcon/>}
            href="https://www.linkedin.com/in/viktor-bezai/"
            target="_blank"
            rel="noopener noreferrer"
            sx={{maxWidth: "350px", width: "100%"}}
          >
            Connect on LinkedIn
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
