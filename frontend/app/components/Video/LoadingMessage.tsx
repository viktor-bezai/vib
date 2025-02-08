"use client";

import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";

const messages = [
  "Searching for the most relevant videos...",
  "Analyzing video content to identify spoken words...",
];


const LoadingMessage: React.FC = () => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageIndex, setMessageIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (charIndex < messages[messageIndex].length) {
        setCurrentMessage((prev) => prev + messages[messageIndex][charIndex]);
        setCharIndex((prev) => prev + 1);
      } else {
        setTimeout(() => {
          setCurrentMessage("");
          setCharIndex(0);
          setMessageIndex((prev) => (prev + 1) % messages.length);
        }, 2000); // Delay before switching message
      }
    }, 50); // Typing speed

    return () => clearInterval(interval);
  }, [charIndex, messageIndex]);

  return (
    <Typography
      sx={{
        fontSize: "1.2rem",
        fontWeight: "bold",
        textAlign: "center",
        whiteSpace: "pre-line",
        marginTop: "1rem",
        color: "#1976d2",
      }}
    >
      {currentMessage} <span>|</span> {/* Cursor effect */}
    </Typography>
  );
};

export default LoadingMessage;
