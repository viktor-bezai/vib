"use client";

import React, {useState} from "react";
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Link from "next/link";
import {useTheme} from "@mui/material/styles";

export default function Header() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "var(--primary-color)",
        padding: "0.5rem 0",
        boxShadow: "0 4px 8px var(--shadow-color)",
      }}
    >
      <Toolbar sx={{display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative"}}>
        {/* App Logo */}
        <Box sx={{flex: 1, display: "flex", justifyContent: "flex-start"}}>
          <Link href="/" style={{textDecoration: "none", color: "var(--button-text-color)"}}>
            <Typography
              variant="h5"
              component="div"
              sx={{
                fontWeight: "bold",
                fontFamily: "'Roboto', sans-serif",
                color: "var(--button-text-color)",
              }}
            >
              Viktor Bezai
            </Typography>
          </Link>
        </Box>

        {/* Desktop Navigation */}
        {!isMobile && (
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
            <Link href="/video" style={{textDecoration: "none", color: "var(--button-text-color)"}}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 500,
                  color: "var(--button-text-color)",
                  textTransform: "uppercase",
                  transition: "0.3s",
                  "&:hover": {
                    textShadow: "0 0 8px white",
                  },
                }}
              >
                Learn by Videos
              </Typography>
            </Link>

            <Typography variant="h5" sx={{color: "var(--button-text-color)"}}>|</Typography>

            <Link href="/about" style={{textDecoration: "none", color: "var(--button-text-color)"}}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 500,
                  color: "var(--button-text-color)",
                  textTransform: "uppercase",
                  transition: "0.3s",
                  "&:hover": {
                    textShadow: "0 0 8px white",
                  },
                }}
              >
                About Me
              </Typography>
            </Link>
          </Box>
        )}

        {/* Mobile Menu Button */}
        {isMobile && (
          <IconButton onClick={() => setDrawerOpen(true)} sx={{color: "var(--button-text-color)"}}>
            <MenuIcon/>
          </IconButton>
        )}

        {/* Mobile Drawer (Sidebar) */}
        <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
          <List sx={{width: 250, backgroundColor: "var(--background-color)", height: "100%"}}>
            <ListItem onClick={() => setDrawerOpen(false)}>
              <Link href="/" style={{textDecoration: "none", color: "var(--text-color)", width: "100%"}}>
                <ListItemText primary="Home"/>
              </Link>
            </ListItem>
            <ListItem onClick={() => setDrawerOpen(false)}>
              <Link href="/video" style={{textDecoration: "none", color: "var(--text-color)", width: "100%"}}>
                <ListItemText primary="Learn by Videos"/>
              </Link>
            </ListItem>
            <ListItem onClick={() => setDrawerOpen(false)}>
              <Link href="/about" style={{textDecoration: "none", color: "var(--text-color)", width: "100%"}}>
                <ListItemText primary="About Me"/>
              </Link>
            </ListItem>
          </List>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
}
