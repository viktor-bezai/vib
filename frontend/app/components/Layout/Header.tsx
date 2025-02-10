"use client";

import React, {useState, useCallback} from "react";
import {AppBar, Box, Drawer, IconButton, Toolbar, Typography, useMediaQuery} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import {useTheme} from "@mui/material/styles";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";
import Link from "next/link";

export default function Header() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = useCallback((open: boolean) => () => {
    setDrawerOpen(open);
  }, []);

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "var(--primary-color)",
          padding: "0.5rem 0",
          boxShadow: "0 4px 8px var(--shadow-color)",
          zIndex: 1100, // Ensure it stays above other content
        }}
      >
        <Toolbar sx={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
          <Box sx={{flex: 1}}>
            <Link href="/" style={{textDecoration: "none", color: "var(--button-text-color)"}}>
              <Typography
                variant="h5" sx={{fontWeight: "bold", color: "var(--button-text-color)"}}>
                {`Viktor Bezai`}
              </Typography>
            </Link>
          </Box>

          {isMobile ? (
            <IconButton onClick={toggleDrawer(true)} sx={{color: "var(--button-text-color)"}}>
              <MenuIcon/>
            </IconButton>
          ) : (
            <DesktopNav/>
          )}

          {/* Mobile Drawer */}
          <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
            <MobileNav toggleDrawer={toggleDrawer}/>
          </Drawer>
        </Toolbar>
      </AppBar>

      <Toolbar/>
    </>
  );
}
