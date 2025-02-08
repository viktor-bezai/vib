"use client";

import React from "react";
import {Box, Typography} from "@mui/material";


const TechStack = () => {

  return (
    <Box
      sx={{
        marginTop: "2rem",
        padding: "1rem",
      }}
    >
      <Typography
        variant="body1"
        sx={{fontWeight: "bold", color: "#333"}}
      >
        {`🔧 Built With:`}
      </Typography>
      <Typography variant="body2" sx={{color: "#555"}}>
        This web application is developed
        using <strong>Django</strong> (Backend), <strong>Next.js</strong> (Frontend),{" "}
        <strong>Docker</strong> (Containerization), and <strong>Jenkins</strong> (CI/CD). It is deployed on a{" "}
        <strong>VPS</strong> using <strong>Nginx</strong> as the reverse proxy.
      </Typography>
    </Box>
  );
};

export default TechStack;
