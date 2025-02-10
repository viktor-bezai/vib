import React from "react";
import Link from "next/link";
import { List, ListItem, ListItemText } from "@mui/material";

const MobileNav = ({ toggleDrawer }: { toggleDrawer: (open: boolean) => () => void }) => (
  <List sx={{ width: 250, backgroundColor: "var(--background-color)", height: "100%" }}>
    <MobileNavItem href="/" toggleDrawer={toggleDrawer}>Home</MobileNavItem>
    <MobileNavItem href="/video" toggleDrawer={toggleDrawer}>Learn by Videos</MobileNavItem>
    <MobileNavItem href="/about" toggleDrawer={toggleDrawer}>About Me</MobileNavItem>
  </List>
);

const MobileNavItem = ({ href, toggleDrawer, children }: {
  href: string;
  toggleDrawer: (open: boolean) => () => void;
  children: React.ReactNode
}) => (
  <ListItem onClick={toggleDrawer(false)} sx={{ textAlign: "center" }}>
    <Link href={href} passHref legacyBehavior>
      <a style={{ textDecoration: "none", width: "100%", display: "block", padding: "8px 16px" }}>
        <ListItemText primary={children} sx={{ color: "var(--text-color)", textAlign: "center" }} />
      </a>
    </Link>
  </ListItem>
);

export default MobileNav;
