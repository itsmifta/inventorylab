// src/App.js
import React, { useState } from "react";
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  InputAdornment,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  Remove,
  Add as AddIcon,
  Search,
} from "@mui/icons-material";

const initialProducts = [
  { id: 1, name: "Apples", price: 1.5, quantity: 10, expiry: "2024-12-31" },
  { id: 2, name: "Oranges", price: 2.0, quantity: 5, expiry: "2024-11-15" },
];

function App() {
  const [products, setProducts] = useState(initialProducts);
  const [open, setOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    name: "",
    price: "",
    quantity: "",
    expiry: "",
  });

  const handleOpen = (product = null) => {
    setEditProduct(product);
    setForm(product || { name: "", price: "", quantity: "", expiry: "" });
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    if (editProduct) {
      setProducts(
        products.map((p) =>
          p.id === editProduct.id ? { ...editProduct, ...form } : p
        )
      );
    } else {
      const newProduct = { ...form, id: Date.now() };
      setProducts([...products, newProduct]);
    }
    handleClose();
  };

  const handleDelete = (id) => setProducts(products.filter((p) => p.id !== id));

  const adjustQuantity = (id, delta) => {
    setProducts(
      products.map((p) =>
        p.id === id
          ? { ...p, quantity: Math.max(0, Number(p.quantity) + delta) }
          : p
      )
    );
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Inventory App
      </Typography>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpen()}
        >
          Add New Product
        </Button>

        <TextField
          label="Search Products"
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            },
          }}
        />
      </div>

      <Table sx={{ mt: 2 }}>
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Product Name</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Expiry Date</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products
            .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
            .map((p, index) => (
              <TableRow key={p.id}>
                <TableCell>{index + 1}</TableCell> {/* Numbering */}
                <TableCell>{p.name}</TableCell>
                <TableCell>${p.price}</TableCell>
                <TableCell>{p.quantity}</TableCell>
                <TableCell>{p.expiry}</TableCell>
                <TableCell>
                  <IconButton onClick={() => adjustQuantity(p.id, 1)}>
                    <AddIcon />
                  </IconButton>
                  <IconButton onClick={() => adjustQuantity(p.id, -1)}>
                    <Remove />
                  </IconButton>
                  <IconButton onClick={() => handleOpen(p)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(p.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      <Dialog
        open={open}
        onClose={handleClose}
        sx={{ "& .MuiDialog-paper": { width: "500px", minHeight: "400px" } }}
      >
        <DialogTitle>
          {editProduct ? "Edit Product" : "Add New Product"}
        </DialogTitle>

        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <TextField
            label="Product Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            margin="dense"
          />
          <TextField
            label="Price"
            name="price"
            value={form.price}
            onChange={handleChange}
            type="number"
          />
          <TextField
            label="Quantity"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            type="number"
          />
          <TextField
            label="Expiry Date"
            name="expiry"
            value={form.expiry}
            onChange={handleChange}
            type="date"
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {editProduct ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default App;
