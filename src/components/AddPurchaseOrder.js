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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

function AddPurchaseOrder({ open, onClose, onAdd, products }) {
  const [receivedDate, setReceivedDate] = useState(new Date());
  const [distributor, setDistributor] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [currentQuantity, setCurrentQuantity] = useState("");
  const [currentCostPerUnit, setCurrentCostPerUnit] = useState("");
  const [productSearch, setProductSearch] = useState("");

  const handleAddProduct = () => {
    // Convert to numbers for validation
    const quantity = Number(currentQuantity);
    const costPerUnit = Number(currentCostPerUnit);

    if (!currentProduct || quantity <= 0 || costPerUnit <= 0) return;

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
          costPerUnit: costPerUnit,
        },
      ]);
    }

    // Reset fields
    setCurrentProduct(null);
    setCurrentQuantity("");
    setCurrentCostPerUnit("");
    setProductSearch("");
  };

  const handleRemoveProduct = (productId) => {
    setSelectedProducts(
      selectedProducts.filter((p) => p.productId !== productId)
    );
  };

  const calculateTotalCost = () => {
    return selectedProducts.reduce(
      (total, product) => total + product.quantity * product.costPerUnit,
      0
    );
  };

  const handleSubmit = () => {
    if (!distributor || selectedProducts.length === 0) return;

    const newOrder = {
      receivedDate,
      distributor,
      totalCost: calculateTotalCost(),
      products: selectedProducts,
    };

    onAdd(newOrder);

    // Reset form
    setReceivedDate(new Date());
    setDistributor("");
    setSelectedProducts([]);
    setCurrentProduct(null);
    setCurrentQuantity("");
    setCurrentCostPerUnit("");
    setProductSearch("");
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6">Add Purchase Order</Typography>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1, mb: 3 }}>
          <Grid item xs={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Received Date"
                value={receivedDate}
                onChange={(newDate) => setReceivedDate(newDate)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Distributor"
              value={distributor}
              onChange={(e) => setDistributor(e.target.value)}
              fullWidth
              required
            />
          </Grid>
        </Grid>

        <Typography variant="h6" sx={{ mb: 2 }}>
          Add Products
        </Typography>

        <Box sx={{ display: "flex", mb: 2, gap: 2 }}>
          <Autocomplete
            sx={{ flexGrow: 1 }}
            options={products}
            value={currentProduct}
            onChange={(event, newValue) => {
              setCurrentProduct(newValue);
              if (newValue && newValue.price > 0) {
                setCurrentCostPerUnit(newValue.price.toString());
              }
            }}
            getOptionLabel={(option) => `${option.name} - $${option.price}`}
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
                    Code: {option.code}
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
            InputProps={{ inputProps: { min: 1 } }}
            sx={{ width: 120 }}
          />
          <TextField
            label="Cost Per Unit"
            type="number"
            value={currentCostPerUnit}
            onChange={(e) => setCurrentCostPerUnit(e.target.value)}
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
              !currentCostPerUnit ||
              Number(currentCostPerUnit) <= 0
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
                <TableCell align="right">Cost Per Unit</TableCell>
                <TableCell align="right">Total Cost</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedProducts.map((product) => (
                <TableRow key={product.productId}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell align="right">{product.quantity}</TableCell>
                  <TableCell align="right">
                    ${product.costPerUnit.toFixed(2)}
                  </TableCell>
                  <TableCell align="right">
                    ${(product.quantity * product.costPerUnit).toFixed(2)}
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
              Total Cost: ${calculateTotalCost().toFixed(2)}
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
          disabled={!distributor || selectedProducts.length === 0}
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

export default AddPurchaseOrder;
