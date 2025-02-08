"use client";

import React from "react";
import {Box, Typography} from "@mui/material";
import Link from "next/link";

const Introduction = () => {

  return (
    <Box>
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
    </Box>
  );
};

export default Introduction;
