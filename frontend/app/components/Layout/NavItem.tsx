import React from "react";
import Link from "next/link";
import { Typography } from "@mui/material";

const NavItem = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link href={href} style={{ textDecoration: "none" }}>
    <Typography
      variant="h5"
      sx={{
        color: "var(--button-text-color)",
        textTransform: "uppercase",
        transition: "0.3s",
        "&:hover": { textShadow: "0 0 8px white" },
      }}
    >
      {children}
    </Typography>
  </Link>
);

export default NavItem;
