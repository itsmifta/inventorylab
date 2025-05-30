import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Box,
  Typography,
  Tooltip,
  ListItemButton,
  useTheme,
} from "@mui/material";
import {
  Inventory as InventoryIcon,
  ShoppingCart as ShoppingCartIcon,
  ReceiptLong as SalesIcon,
  AccountCircle as AccountIcon,
  Logout as LogoutIcon,
  ChevronLeft as ChevronLeftIcon,
  Menu as MenuIcon,
  Science as ScienceIcon,
} from "@mui/icons-material";

function Navigation({ user, onLogout }) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const drawerWidth = 240;
  const closedDrawerWidth = theme.spacing(7); // Maintain a small width when collapsed

  const menuItems = [
    {
      text: "Product List",
      icon: <InventoryIcon />,
      path: "/",
      active: location.pathname === "/",
    },
    {
      text: "Purchase Orders",
      icon: <ShoppingCartIcon />,
      path: "/purchase-orders",
      active: location.pathname === "/purchase-orders",
    },
    {
      text: "Sales Orders",
      icon: <SalesIcon />,
      path: "/sales-orders",
      active: location.pathname === "/sales-orders",
    },
  ];

  return (
    <>
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          width: open ? drawerWidth : closedDrawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: open ? drawerWidth : closedDrawerWidth,
            overflowX: "hidden",
            backgroundColor: "#f0f0f0",
            transition: theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            boxSizing: "border-box",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: open ? "space-between" : "center",
            padding: theme.spacing(0, 1),
            ...theme.mixins.toolbar,
          }}
        >
          {open ? (
            <>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, ml: 1 }}
              >
                <Typography
                  variant="h6"
                  noWrap
                  component="div"
                  color="#6a0dad"
                  sx={{ fontWeight: "bold" }}
                >
                  InventoryLab
                </Typography>
                <ScienceIcon
                  sx={{
                    fontSize: "1.5rem",
                    color: "#6a0dad",
                    transform: "rotate(25deg)",
                  }}
                />
              </Box>
              <IconButton onClick={toggleDrawer} color="primary">
                <ChevronLeftIcon />
              </IconButton>
            </>
          ) : (
            <IconButton onClick={toggleDrawer} color="primary">
              <MenuIcon />
            </IconButton>
          )}
        </Box>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <ListItem
              key={item.text}
              disablePadding
              sx={{
                display: "block",
                backgroundColor: item.active
                  ? "rgba(106, 13, 173, 0.1)"
                  : "transparent",
              }}
            >
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
                onClick={() => navigate(item.path)}
              >
                <Tooltip title={open ? "" : item.text} placement="right">
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                      color: item.active ? "#6a0dad" : "inherit",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                </Tooltip>
                <ListItemText
                  primary={item.text}
                  sx={{
                    opacity: open ? 1 : 0,
                    color: item.active ? "#6a0dad" : "inherit",
                    fontWeight: item.active ? "bold" : "normal",
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <Box sx={{ flexGrow: 1 }} />
        <List>
          {user && (
            <ListItem disablePadding sx={{ display: "block" }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <Tooltip title={open ? "" : "Account"} placement="right">
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    <AccountIcon />
                  </ListItemIcon>
                </Tooltip>
                <ListItemText
                  primary={user.username}
                  secondary={user.role}
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </ListItem>
          )}
          <ListItem disablePadding sx={{ display: "block" }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
              }}
              onClick={onLogout}
            >
              <Tooltip title={open ? "" : "Logout"} placement="right">
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  <LogoutIcon />
                </ListItemIcon>
              </Tooltip>
              <ListItemText primary="Logout" sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </>
  );
}

export default Navigation;
