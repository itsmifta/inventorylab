import React from "react";
import { Box, Typography } from "@mui/material";

function Header() {
  return (
    <Box
      sx={{
        mb: 4,
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: 0,
        paddingBottom: 2,
        borderRadius: 2,
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontWeight: 500,
          margin: 0,
        }}
      >
        Inventory App
      </Typography>
    </Box>
  );
}

export default Header;
