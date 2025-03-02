"use client";
import Image from "next/image";
import React from "react";
import {Box, Button, Container, Typography} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import WebIcon from "@mui/icons-material/Public";
import DescriptionIcon from "@mui/icons-material/Description";
import ApiIcon from "@mui/icons-material/Api";

export default function AboutPage() {
  return (
    <Container
      maxWidth="md"
      sx={{
        textAlign: "center",
        marginTop: "2rem",
        marginBottom: "2rem",
        padding: {xs: "0 2rem", sm: "2rem 2rem"},
        backgroundColor: "#f9f9f9",
        borderRadius: "12px",
        boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Profile Image */}
      <Image
        src="/images/profile.jpeg"
        alt="Viktor Bezai"
        width={150}
        height={150}
        style={{
          borderRadius: "50%",
          objectFit: "cover",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
        }}
      />

      {/* About Heading */}
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontWeight: "bold",
          color: "#1976d2",
          fontSize: {xs: "1.8rem", sm: "2rem", md: "2.5rem"},
        }}
      >
        About Me
      </Typography>

      {/* Short Description */}
      <Typography
        variant="body1"
        gutterBottom
        sx={{
          marginTop: "1rem",
          color: "#555",
          width: {xs: "100%", sm: "80%"},
          margin: "0 auto",
        }}
      >
        {`Hello! I’m Viktor Bezai, a passionate Full-Stack Software Developer specializing in building scalable web
          applications with Python (Django/FastAPI) and JavaScript (React/Next.js).`}
        <br/>
        {`I thrive on solving complex challenges and delivering impactful solutions 
        through clean architecture and automation.`}
      </Typography>


      {/* External Links - Centered & Less Wide */}
      <Box sx={{marginTop: "2rem", textAlign: "center"}}>
        <Box sx={{display: "flex", flexDirection: "column", alignItems: "center", gap: 2}}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<LinkedInIcon/>}
            href="https://www.linkedin.com/in/viktor-bezai/"
            target="_blank"
            rel="noopener noreferrer"
            sx={{maxWidth: "350px", width: "100%"}} // Less wide & centered
          >
            Connect on LinkedIn
          </Button>

          <Button
            variant="contained"
            color="inherit"
            startIcon={<GitHubIcon/>}
            href="https://github.com/viktor-bezai"
            target="_blank"
            rel="noopener noreferrer"
            sx={{maxWidth: "350px", width: "100%"}}
          >
            View My GitHub
          </Button>

          <Button
            variant="contained"
            color="secondary"
            startIcon={<DescriptionIcon/>}
            href="/resume/Viktor_Bezai_Software_Developer.pdf"
            target="_blank"
            rel="noopener noreferrer"
            sx={{maxWidth: "350px", width: "100%"}}
          >
            Download My Resume
          </Button>

          <Button
            variant="contained"
            color="info"
            startIcon={<ApiIcon/>}
            href="/swagger"
            target="_blank"
            rel="noopener noreferrer"
            sx={{maxWidth: "350px", width: "100%"}}
          >
            API Documentation
          </Button>

          <Button
            variant="contained"
            color="success"
            startIcon={<WebIcon/>}
            href="https://mystical-egypt-travels.online/"
            target="_blank"
            rel="noopener noreferrer"
            sx={{maxWidth: "350px", width: "100%"}}
          >
            Mystical Egypt Travels 🌍
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
