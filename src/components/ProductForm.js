import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "./Header";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Breadcrumbs,
  Link,
  Snackbar,
  Alert,
} from "@mui/material";
import { NavigateNext } from "@mui/icons-material";

function ProductForm({ products, setProducts }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    code: "",
    price: "",
    quantity: "",
    expiry: "",
  });
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Determine if we're editing an existing product
  const isEditMode = !!id;

  // If editing, load the product data
  useEffect(() => {
    if (isEditMode) {
      const productToEdit = products.find((p) => p.id === Number(id));
      if (productToEdit) {
        setForm(productToEdit);
      } else {
        // Product not found, redirect to list
        navigate("/");
      }
    }
  }, [id, isEditMode, navigate, products]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const closeToast = () => {
    setToast({ ...toast, open: false });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate code uniqueness for new products
    if (!isEditMode) {
      const codeExists = products.some((p) => p.code === form.code);
      if (codeExists) {
        setToast({
          open: true,
          message: `Product code "${form.code}" already exists. Please use a unique code.`,
          severity: "error",
        });
        return;
      }
    }

    let message = "";

    if (isEditMode) {
      // Update existing product
      setProducts(products.map((p) => (p.id === Number(id) ? { ...form } : p)));
      message = `Product "${form.name}" has been updated successfully!`;
    } else {
      // Add new product with a new ID
      const newId = Math.max(0, ...products.map((p) => p.id)) + 1;
      setProducts([...products, { ...form, id: newId }]);
      message = `Product "${form.name}" has been added successfully!`;
    }

    // Store message in localStorage to retrieve it after navigation
    localStorage.setItem(
      "productToast",
      JSON.stringify({
        message,
        severity: "success",
        timestamp: new Date().getTime(),
      })
    );

    // Navigate immediately to the product list
    navigate("/");
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Header />
      {/* Breadcrumbs */}
      <Breadcrumbs
        separator={<NavigateNext fontSize="small" />}
        aria-label="breadcrumb"
        sx={{ mb: 3 }}
      >
        <Link
          underline="hover"
          color="inherit"
          onClick={() => navigate("/")}
          sx={{ cursor: "pointer" }}
        >
          Product List
        </Link>
        <Typography color="text.primary">
          {isEditMode ? "Edit Product" : "Add New Product"}
        </Typography>
      </Breadcrumbs>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          {isEditMode ? "Edit Product" : "Add New Product"}
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Code"
            name="code"
            value={form.code}
            onChange={handleChange}
            margin="normal"
            required
            placeholder="e.g. PRD001"
            helperText="Unique product identifier code"
          />

          <TextField
            fullWidth
            label="Product Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Price"
            name="price"
            value={form.price}
            onChange={handleChange}
            type="number"
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Quantity"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            type="number"
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Expiry Date"
            name="expiry"
            value={form.expiry}
            onChange={handleChange}
            type="date"
            margin="normal"
            InputLabelProps={{ shrink: true }}
            required
          />

          <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
            <Button variant="outlined" onClick={() => navigate("/")}>
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              {isEditMode ? "Update" : "Add"} Product
            </Button>
          </Box>
        </Box>
      </Paper>

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
    </Container>
  );
}

export default ProductForm;
