import React from "react";
import { Box, Typography } from "@mui/material";
import NavItem from "./NavItem";

const DesktopNav = () => (
  <Box
    sx={{
      position: "absolute",
      left: "50%",
      transform: "translateX(-50%)",
      display: "flex",
      gap: "1rem",
      alignItems: "center",
    }}
  >
    <NavItem href="/video">Learn by Videos</NavItem>
    <Typography variant="h5" sx={{ color: "var(--button-text-color)" }}>|</Typography>
    <NavItem href="/about">About Me</NavItem>
  </Box>
);

export default DesktopNav;
