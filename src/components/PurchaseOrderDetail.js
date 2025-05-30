import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from "@mui/material";
import { format } from "date-fns";

function PurchaseOrderDetail({ open, order, onClose, onStatusChange }) {
  if (!order) return null;

  const handleStatusChange = (event) => {
    if (onStatusChange) {
      onStatusChange(order.id, event.target.value);
    }
  };

  // Function to determine chip color based on status
  const getStatusChipColor = (status) => {
    switch (status?.toLowerCase()) {
      case "received":
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
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6">Purchase Order Details</Typography>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6} md={3}>
            <Typography variant="subtitle2">Order ID</Typography>
            <Typography variant="body1">{order.id}</Typography>
          </Grid>
          <Grid item xs={6} md={3}>
            <Typography variant="subtitle2">Received Date</Typography>
            <Typography variant="body1">
              {format(new Date(order.receivedDate), "MMMM dd, yyyy")}
            </Typography>
          </Grid>
          <Grid item xs={6} md={3}>
            <Typography variant="subtitle2">Distributor</Typography>
            <Typography variant="body1">{order.distributor}</Typography>
          </Grid>
          <Grid item xs={6} md={3}>
            <Typography variant="subtitle2">Total Cost</Typography>
            <Typography variant="body1" fontWeight="bold">
              ${order.totalCost.toFixed(2)}
            </Typography>
          </Grid>

          {/* Status field - added as new feature */}
          <Grid item xs={12} sx={{ mt: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography variant="subtitle2">Status:</Typography>
              {order.status && (
                <Chip
                  label={order.status}
                  size="small"
                  color={getStatusChipColor(order.status)}
                />
              )}
              {onStatusChange && (
                <FormControl size="small" sx={{ minWidth: 150, ml: 2 }}>
                  <InputLabel>Change Status</InputLabel>
                  <Select
                    value={order.status || "Pending"}
                    label="Change Status"
                    onChange={handleStatusChange}
                  >
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Received">Received</MenuItem>
                    <MenuItem value="Cancelled">Cancelled</MenuItem>
                  </Select>
                </FormControl>
              )}
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" sx={{ mb: 2 }}>
          Products
        </Typography>
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product Name</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Cost Per Unit</TableCell>
                <TableCell>Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {order.products.map((product) => (
                <TableRow key={product.productId}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>${product.costPerUnit.toFixed(2)}</TableCell>
                  <TableCell>
                    ${(product.quantity * product.costPerUnit).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
              {order.products.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No products in this order
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Typography variant="h6">
            Total: ${order.totalCost.toFixed(2)}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          sx={{
            color: "#6a0dad",
            "&:hover": { color: "#5a0b9d" },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default PurchaseOrderDetail;
