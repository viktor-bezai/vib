"use client";

import React, {useState, useEffect} from "react";
import {Box, Typography} from "@mui/material";

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({message}) => {
  const [currentText, setCurrentText] = useState("");

  useEffect(() => {
    setCurrentText(""); // Reset text when message changes

    if (!message) return; // Prevent unnecessary effect

    let charIndex = 0;

    const interval = setInterval(() => {
      setCurrentText((prev) => {
        if (charIndex >= message.length) {
          clearInterval(interval);
          return prev; // Keep final message
        }
        charIndex++; // Move to next character
        return message.substring(0, charIndex); // Take substring
      });
    }, 50); // Typing speed

    return () => clearInterval(interval);
  }, [message]); // Run only when message changes

  return (
    <Box sx={{width: "80%"}}>
      <Typography
        sx={{
          fontSize: {xs: "0.8rem", md: "1rem"},
          fontWeight: "bold",
          textAlign: "center",
          color: "var(--text-color)",
        }}
      >
        {currentText}
        <span>|</span> {/* Cursor effect */}
      </Typography>
    </Box>
  );
};

export default ErrorMessage;
