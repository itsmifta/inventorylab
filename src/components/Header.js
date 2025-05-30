import React from "react";
import {
  Box,
  Typography,
  Button,
  Avatar,
  Tooltip,
  ButtonGroup,
} from "@mui/material";
import ScienceIcon from "@mui/icons-material/Science";
import LogoutIcon from "@mui/icons-material/Logout";
import InventoryIcon from "@mui/icons-material/Inventory";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { Link, useLocation } from "react-router-dom";

function Header({ user, onLogout }) {
  const location = useLocation();

  return (
    <Box
      sx={{
        mb: 4,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 0,
        paddingBottom: 2,
        borderRadius: 2,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: 500,
            margin: 0,
            color: "2c3e50",
          }}
        >
          InventoryLab
        </Typography>
        <ScienceIcon
          sx={{
            fontSize: "2.5rem",
            color: "#6a0dad",
            transform: "rotate(25deg)",
          }}
        />
      </Box>

      {user && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* Navigation buttons */}
          <ButtonGroup variant="outlined" size="small">
            <Button
              component={Link}
              to="/"
              startIcon={<InventoryIcon />}
              sx={{
                color: location.pathname === "/" ? "#ffffff" : "#6a0dad",
                bgcolor: location.pathname === "/" ? "#6a0dad" : "transparent",
                borderColor: "#6a0dad",
                "&:hover": {
                  borderColor: "#5a0b9d",
                  bgcolor:
                    location.pathname === "/"
                      ? "#5a0b9d"
                      : "rgba(106, 13, 173, 0.1)",
                },
              }}
            >
              Products
            </Button>
            <Button
              component={Link}
              to="/purchase-orders"
              startIcon={<ShoppingCartIcon />}
              sx={{
                color:
                  location.pathname === "/purchase-orders"
                    ? "#ffffff"
                    : "#6a0dad",
                bgcolor:
                  location.pathname === "/purchase-orders"
                    ? "#6a0dad"
                    : "transparent",
                borderColor: "#6a0dad",
                "&:hover": {
                  borderColor: "#5a0b9d",
                  bgcolor:
                    location.pathname === "/purchase-orders"
                      ? "#5a0b9d"
                      : "rgba(106, 13, 173, 0.1)",
                },
              }}
            >
              Purchase
            </Button>
            <Button
              component={Link}
              to="/sales-orders"
              startIcon={<LocalShippingIcon />}
              sx={{
                color:
                  location.pathname === "/sales-orders" ? "#ffffff" : "#6a0dad",
                bgcolor:
                  location.pathname === "/sales-orders"
                    ? "#6a0dad"
                    : "transparent",
                borderColor: "#6a0dad",
                "&:hover": {
                  borderColor: "#5a0b9d",
                  bgcolor:
                    location.pathname === "/sales-orders"
                      ? "#5a0b9d"
                      : "rgba(106, 13, 173, 0.1)",
                },
              }}
            >
              Sales
            </Button>
          </ButtonGroup>

          <Tooltip title={`Logged in as ${user.username}`}>
            <Avatar
              sx={{
                bgcolor: "#6a0dad", // Changed from blue to dark purple
                color: "white",
                width: 36,
                height: 36,
                fontSize: "1rem",
                fontWeight: "bold",
              }}
            >
              {user.username.charAt(0).toUpperCase()}
            </Avatar>
          </Tooltip>
          <Button
            variant="outlined"
            color="secondary"
            size="small"
            onClick={onLogout}
            startIcon={<LogoutIcon />}
            sx={{
              color: "#6a0dad",
              borderColor: "#6a0dad",
              "&:hover": { borderColor: "#5a0b9d", color: "#5a0b9d" },
            }} // Updated to darker purple
          >
            Logout
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default Header;
