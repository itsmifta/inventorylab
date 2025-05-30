import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  IconButton,
  Grid,
  InputAdornment,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

function AddSalesOrder({ open, onClose, onAdd, products }) {
  const [orderDate, setOrderDate] = useState(new Date());
  const [customer, setCustomer] = useState("");
  const [status, setStatus] = useState("Pending");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [currentQuantity, setCurrentQuantity] = useState("");
  const [currentPricePerUnit, setCurrentPricePerUnit] = useState("");
  const [productSearch, setProductSearch] = useState("");

  const handleAddProduct = () => {
    // Convert to numbers for validation
    const quantity = Number(currentQuantity);
    const pricePerUnit = Number(currentPricePerUnit);

    if (!currentProduct || quantity <= 0 || pricePerUnit <= 0) return;

    // Check if product has enough quantity in inventory
    if (currentProduct.quantity < quantity) {
      alert(
        `Not enough stock for ${currentProduct.name}. Available: ${currentProduct.quantity}`
      );
      return;
    }

    const existingProductIndex = selectedProducts.findIndex(
      (p) => p.productId === currentProduct.id
    );

    if (existingProductIndex >= 0) {
      // Update existing product quantity
      const updatedProducts = [...selectedProducts];
      updatedProducts[existingProductIndex].quantity += quantity;
      setSelectedProducts(updatedProducts);
    } else {
      // Add new product
      setSelectedProducts([
        ...selectedProducts,
        {
          productId: currentProduct.id,
          name: currentProduct.name,
          quantity: quantity,
          pricePerUnit: pricePerUnit,
        },
      ]);
    }

    // Reset fields
    setCurrentProduct(null);
    setCurrentQuantity("");
    setCurrentPricePerUnit("");
    setProductSearch("");
  };

  const handleRemoveProduct = (productId) => {
    setSelectedProducts(
      selectedProducts.filter((p) => p.productId !== productId)
    );
  };

  const calculateTotalAmount = () => {
    return selectedProducts.reduce(
      (total, product) => total + product.quantity * product.pricePerUnit,
      0
    );
  };

  const handleSubmit = () => {
    if (!customer || selectedProducts.length === 0) return;

    const newOrder = {
      orderDate,
      customer,
      totalAmount: calculateTotalAmount(),
      products: selectedProducts,
      status,
    };

    onAdd(newOrder);

    // Reset form
    setOrderDate(new Date());
    setCustomer("");
    setStatus("Pending");
    setSelectedProducts([]);
    setCurrentProduct(null);
    setCurrentQuantity("");
    setCurrentPricePerUnit("");
    setProductSearch("");
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6">Add Sales Order</Typography>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1, mb: 3 }}>
          <Grid item xs={4}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Order Date"
                value={orderDate}
                onChange={(newDate) => setOrderDate(newDate)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Customer"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={status}
                label="Status"
                onChange={(e) => setStatus(e.target.value)}
              >
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Typography variant="h6" sx={{ mb: 2 }}>
          Add Products
        </Typography>

        <Box sx={{ display: "flex", mb: 2, gap: 2 }}>
          <Autocomplete
            sx={{ flexGrow: 1 }}
            options={products.filter((product) => product.quantity > 0)} // Only show products with stock
            value={currentProduct}
            onChange={(event, newValue) => {
              setCurrentProduct(newValue);
              if (newValue && newValue.price > 0) {
                setCurrentPricePerUnit(newValue.price.toString());
              }
            }}
            getOptionLabel={(option) =>
              `${option.name} - $${option.price} (Stock: ${option.quantity})`
            }
            renderOption={(props, option) => (
              <li {...props}>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Typography variant="body1">
                    {option.name} - ${option.price}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontFamily: "monospace" }}
                  >
                    Code: {option.code} | Available: {option.quantity}
                  </Typography>
                </Box>
              </li>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search Products"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <>
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                      {params.InputProps.startAdornment}
                    </>
                  ),
                }}
              />
            )}
            isOptionEqualToValue={(option, value) => option.id === value?.id}
            filterOptions={(options, state) => {
              const inputValue = state.inputValue.toLowerCase();
              return options.filter(
                (option) =>
                  option.name.toLowerCase().includes(inputValue) ||
                  option.code?.toLowerCase().includes(inputValue)
              );
            }}
          />
          <TextField
            label="Quantity"
            type="number"
            value={currentQuantity}
            onChange={(e) => setCurrentQuantity(e.target.value)}
            InputProps={{
              inputProps: {
                min: 1,
                max: currentProduct ? currentProduct.quantity : 1,
              },
            }}
            sx={{ width: 120 }}
          />
          <TextField
            label="Price Per Unit"
            type="number"
            value={currentPricePerUnit}
            onChange={(e) => setCurrentPricePerUnit(e.target.value)}
            InputProps={{ inputProps: { min: 0, step: 0.01 } }}
            sx={{ width: 150 }}
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddProduct}
            disabled={
              !currentProduct ||
              !currentQuantity ||
              Number(currentQuantity) <= 0 ||
              Number(currentQuantity) > (currentProduct?.quantity || 0) ||
              !currentPricePerUnit ||
              Number(currentPricePerUnit) <= 0
            }
            sx={{
              backgroundColor: "#6a0dad",
              "&:hover": { backgroundColor: "#5a0b9d" },
            }}
          >
            Add
          </Button>
        </Box>

        <TableContainer component={Paper} sx={{ mb: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="right">Price Per Unit</TableCell>
                <TableCell align="right">Total Price</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedProducts.map((product) => (
                <TableRow key={product.productId}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell align="right">{product.quantity}</TableCell>
                  <TableCell align="right">
                    ${product.pricePerUnit.toFixed(2)}
                  </TableCell>
                  <TableCell align="right">
                    ${(product.quantity * product.pricePerUnit).toFixed(2)}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      onClick={() => handleRemoveProduct(product.productId)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={8}>
            <Typography variant="subtitle1">
              Total Amount: ${calculateTotalAmount().toFixed(2)}
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          sx={{
            color: "#6a0dad",
            borderColor: "#6a0dad",
            "&:hover": { color: "#5a0b9d" },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!customer || selectedProducts.length === 0}
          sx={{
            backgroundColor: "#6a0dad",
            "&:hover": { backgroundColor: "#5a0b9d" },
          }}
        >
          Create Order
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddSalesOrder;
