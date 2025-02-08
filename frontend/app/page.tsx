"use client";

import React from "react";
import {Box, Button, Container} from "@mui/material";

import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TechStack from "@/app/components/Home/TechStack";
import Introduction from "@/app/components/Home/Introduction";

export default function HomePage() {

  return (
    <Container
      maxWidth="md"
      sx={{
        textAlign: "center",
        marginTop: "2rem",
        marginBottom: "2rem",
        padding: "2rem",
        backgroundColor: "#f9f9f9",
        borderRadius: "12px",
        boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
      }}
    >

      {/* Introduction */}
      <Introduction/>

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

      {/* Tech Stack Section */}
      <TechStack/>

    </Container>
  );
}
