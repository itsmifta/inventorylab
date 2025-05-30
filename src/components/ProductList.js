import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  IconButton,
  InputAdornment,
  Paper,
  Box,
  Snackbar,
  Alert,
  Tooltip,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  Remove,
  Add as AddIcon,
  Search,
  FilterList,
} from "@mui/icons-material";

function ProductList({ products, setProducts, onLogout, user }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  // Add state for delete confirmation dialog
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    productId: null,
    productName: "",
  });

  // Check for stored toast message when component mounts
  useEffect(() => {
    const storedToast = localStorage.getItem("productToast");

    if (storedToast) {
      const parsedToast = JSON.parse(storedToast);
      const currentTime = new Date().getTime();

      if (currentTime - parsedToast.timestamp < 2000) {
        setToast({
          open: true,
          message: parsedToast.message,
          severity: parsedToast.severity,
        });
      }

      localStorage.removeItem("productToast");
    }
  }, []);

  const closeToast = () => {
    setToast({ ...toast, open: false });
  };

  // Open confirmation dialog
  const openDeleteDialog = (id, name) => {
    setDeleteDialog({
      open: true,
      productId: id,
      productName: name,
    });
  };

  // Close confirmation dialog
  const closeDeleteDialog = () => {
    setDeleteDialog({
      open: false,
      productId: null,
      productName: "",
    });
  };

  // Confirm deletion
  const confirmDelete = () => {
    const { productId, productName } = deleteDialog;

    // Delete the product
    setProducts(products.filter((p) => p.id !== productId));

    // Show success toast
    setToast({
      open: true,
      message: `Product "${productName}" has been deleted successfully!`,
      severity: "success",
    });

    // Close the dialog
    closeDeleteDialog();
  };

  const handleDelete = (id) => {
    const productToDelete = products.find((p) => p.id === id);
    if (productToDelete) {
      openDeleteDialog(id, productToDelete.name);
    }
  };

  const adjustQuantity = (id, delta) => {
    setProducts(
      products.map((p) =>
        p.id === id
          ? { ...p, quantity: Math.max(0, Number(p.quantity) + delta) }
          : p
      )
    );

    const product = products.find((p) => p.id === id);
    if (product) {
      setToast({
        open: true,
        message: `Quantity for "${product.name}" has been updated!`,
        severity: "info",
      });
    }
  };

  // Helper function to check if a product is expired with proper timezone handling
  const isExpired = (expiryDate) => {
    // Get current date in user's timezone
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to beginning of day

    // Parse the expiry date in user's timezone
    const [year, month, day] = expiryDate.split("-");

    // Create date in user's timezone (months are 0-indexed in JavaScript)
    const expiry = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    expiry.setHours(0, 0, 0, 0);

    // Compare dates (using <= so items expiring today are marked as expired)
    return expiry <= today;
  };

  // Helper function to get product status
  const getProductStatus = (product) => {
    if (product.quantity <= 0) return "outOfStock";
    if (isExpired(product.expiry)) return "expired";
    return "good";
  };

  // Filter products based on search and status
  const filteredProducts = products.filter((p) => {
    // Search in both product name and code
    const searchTerm = search.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm) ||
      p.code.toLowerCase().includes(searchTerm);

    // Then apply status filter if not "all"
    if (statusFilter === "all") return matchesSearch;

    const status = getProductStatus(p);
    return matchesSearch && status === statusFilter;
  });

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
          Product List
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
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate("/add")}
              sx={{
                backgroundColor: "#6a0dad",
                "&:hover": { backgroundColor: "#5a0b9d" },
              }}
            >
              Add New Product
            </Button>
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            {/* Status Filter */}
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel id="status-filter-label">Status</InputLabel>
              <Select
                labelId="status-filter-label"
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <FilterList fontSize="small" />
                  </InputAdornment>
                }
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="good">Good</MenuItem>
                <MenuItem value="expired">Expired</MenuItem>
                <MenuItem value="outOfStock">Out of Stock</MenuItem>
              </Select>
            </FormControl>

            {/* Search Field */}
            <TextField
              label="Search by name or code"
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
        </Box>

        <Paper elevation={1} sx={{ overflow: "hidden" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Code</TableCell>
                <TableCell>Product Name</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Expiry Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts.map((p, index) => (
                <TableRow key={p.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      fontFamily="monospace"
                      fontWeight="medium"
                    >
                      {p.code}
                    </Typography>
                  </TableCell>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>${p.price}</TableCell>
                  <TableCell>{p.quantity}</TableCell>
                  <TableCell>{p.expiry}</TableCell>
                  <TableCell>
                    {p.quantity <= 0 ? (
                      <Chip
                        label="Out of Stock"
                        color="warning"
                        size="small"
                        sx={{ fontWeight: "bold" }}
                      />
                    ) : isExpired(p.expiry) ? (
                      <Chip
                        label="Expired"
                        color="error"
                        size="small"
                        sx={{ fontWeight: "bold" }}
                      />
                    ) : (
                      <Chip
                        label="Good"
                        color="success"
                        size="small"
                        sx={{ fontWeight: "bold" }}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Decrease">
                      <IconButton onClick={() => adjustQuantity(p.id, -1)}>
                        <Remove />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Increase">
                      <IconButton onClick={() => adjustQuantity(p.id, 1)}>
                        <AddIcon />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Edit">
                      <IconButton onClick={() => navigate(`/edit/${p.id}`)}>
                        <Edit />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Delete">
                      <IconButton onClick={() => handleDelete(p.id)}>
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}

              {/* Display message when no products match the filters */}
              {filteredProducts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" color="text.secondary">
                      No products found matching your criteria.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={closeDeleteDialog}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
        PaperProps={{
          sx: {
            maxWidth: "400px",
            width: "100%",
            position: "absolute",
            top: "10%",
          },
        }}
        sx={{
          "& .MuiDialog-container": {
            alignItems: "flex-start",
          },
        }}
      >
        <DialogTitle id="delete-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete "{deleteDialog.productName}"? This
            action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

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
  );
}

export default ProductList;
