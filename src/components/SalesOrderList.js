import React, { useState, useEffect } from "react";
import Navigation from "./Navigation";
import {
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  TextField,
  InputAdornment,
  Paper,
  Box,
  Snackbar,
  Alert,
  IconButton,
  Tooltip,
  Chip,
} from "@mui/material";
import { Add, Search, Visibility as VisibilityIcon } from "@mui/icons-material";
import { format } from "date-fns";
import AddSalesOrder from "./AddSalesOrder";
import SalesOrderDetail from "./SalesOrderDetail";

function SalesOrderList({
  salesOrders,
  setSalesOrders,
  products,
  setProducts,
  onLogout,
  user,
}) {
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);

  // Check for stored toast message when component mounts
  useEffect(() => {
    const storedToast = localStorage.getItem("salesOrderToast");

    if (storedToast) {
      try {
        const parsedToast = JSON.parse(storedToast);
        const currentTime = new Date().getTime();

        if (currentTime - parsedToast.timestamp < 2000) {
          setToast({
            open: true,
            message: parsedToast.message,
            severity: parsedToast.severity,
          });
        }
      } catch (error) {
        console.error("Error parsing toast from localStorage:", error);
      }

      localStorage.removeItem("salesOrderToast");
    }
  }, []);

  // Debug toast state changes
  useEffect(() => {
    console.log("Sales toast state changed:", toast);
  }, [toast]);

  // Function to directly show toast notification
  const showToast = (message, severity = "success") => {
    console.log("Showing sales toast:", { message, severity });
    // Force a new object to ensure state update is detected
    setToast({
      open: true,
      message,
      severity,
      // Add a timestamp to force state to be recognized as different
      timestamp: new Date().getTime(),
    });
  };

  const closeToast = () => {
    setToast((prevToast) => ({ ...prevToast, open: false }));
  };

  const handleViewDetail = (order) => {
    setSelectedOrder(order);
    setOpenDetailDialog(true);
  };

  // Function to update product quantities based on sales order
  const updateProductQuantities = (orderProducts) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) => {
        // Find if this product is in the order
        const orderedProduct = orderProducts.find(
          (op) => op.productId === product.id
        );

        if (orderedProduct) {
          // Subtract the ordered quantity from the current product quantity
          return {
            ...product,
            quantity:
              Number(product.quantity) - Number(orderedProduct.quantity),
          };
        }

        // Return unchanged product if it's not in the order
        return product;
      })
    );
  };

  const handleAddOrder = (newOrder) => {
    // Create a new order with the next available ID
    const newId =
      salesOrders.length > 0
        ? Math.max(...salesOrders.map((order) => order.id)) + 1
        : 1;

    const orderWithId = { ...newOrder, id: newId };
    setSalesOrders([...salesOrders, orderWithId]);

    // Update product quantities - subtract from inventory
    updateProductQuantities(newOrder.products);

    setOpenAddDialog(false);

    // Show success toast with updated message
    showToast(
      `Sales order #${newId} for ${newOrder.customer} has been added and inventory has been updated!`,
      "success"
    );

    // Debug log
    console.log("Setting sales toast after adding order:", {
      open: true,
      message: `Sales order #${newId} for ${newOrder.customer} has been added and inventory has been updated!`,
      severity: "success",
    });
  };

  // Function to handle status change
  const handleStatusChange = (orderId, newStatus) => {
    const updatedOrders = salesOrders.map((order) =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );

    setSalesOrders(updatedOrders);

    const updatedOrder = updatedOrders.find((order) => order.id === orderId);

    // Show different messages based on status
    let message = `Sales order #${orderId} for ${updatedOrder.customer} status changed to ${newStatus}`;
    let severity = "success";

    // For cancelled orders, we might want to provide more information
    if (newStatus === "Cancelled") {
      message = `Sales order #${orderId} for ${updatedOrder.customer} has been cancelled. Note: This does not automatically return items to inventory.`;
      severity = "warning";
    }

    showToast(message, severity);

    // Debug log
    console.log("Setting sales toast after status change:", {
      open: true,
      message,
      severity,
    });
  };

  // Filter sales orders based on search
  const filteredOrders = salesOrders.filter((order) => {
    const searchTerm = search.toLowerCase();
    return (
      order.customer.toLowerCase().includes(searchTerm) ||
      order.id.toString().includes(searchTerm) ||
      order.status.toLowerCase().includes(searchTerm)
    );
  });

  // Function to determine chip color based on status
  const getStatusChipColor = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "success";
      case "pending":
        return "warning";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Box sx={{ display: "flex", width: "100%" }}>
      <Navigation user={user} onLogout={onLogout} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: "100%",
          transition: (theme) =>
            theme.transitions.create(["margin", "width"], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
        }}
      >
        <Typography variant="h5" color="#000000" sx={{ mb: 3 }}>
          Sales Orders
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
            mb: 2,
          }}
        >
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpenAddDialog(true)}
              sx={{
                backgroundColor: "#6a0dad",
                "&:hover": { backgroundColor: "#5a0b9d" },
              }}
            >
              Add Sales Order
            </Button>
          </Box>

          <TextField
            label="Search by customer, ID or status"
            variant="outlined"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Paper elevation={1} sx={{ overflow: "hidden" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Order Date</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Total Amount</TableCell>
                <TableCell>Products Count</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>
                    {format(new Date(order.orderDate), "yyyy-MM-dd")}
                  </TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                  <TableCell>{order.products.length}</TableCell>
                  <TableCell>
                    <Chip
                      label={order.status}
                      size="small"
                      color={getStatusChipColor(order.status)}
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title="View Details">
                      <IconButton onClick={() => handleViewDetail(order)}>
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}

              {/* Display message when no orders match the filters */}
              {filteredOrders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" color="text.secondary">
                      No sales orders found matching your criteria.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>

        {/* Sales Order Detail Dialog */}
        {selectedOrder && (
          <SalesOrderDetail
            open={openDetailDialog}
            order={selectedOrder}
            onClose={() => setOpenDetailDialog(false)}
            onStatusChange={handleStatusChange}
          />
        )}

        {/* Add Sales Order Dialog */}
        <AddSalesOrder
          open={openAddDialog}
          onClose={() => setOpenAddDialog(false)}
          onAdd={handleAddOrder}
          products={products}
        />

        {/* Toast notification */}
        <Snackbar
          open={toast.open}
          autoHideDuration={3000}
          onClose={closeToast}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={closeToast}
            severity={toast.severity}
            sx={{ width: "100%" }}
          >
            {toast.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
}

export default SalesOrderList;
