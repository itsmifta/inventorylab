import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductList from "./components/ProductList";
import ProductForm from "./components/ProductForm";
import { Box, CssBaseline } from "@mui/material";

const initialProducts = [
  {
    id: 1,
    code: "NDL001",
    name: "Indomie Instant Noodles",
    price: 1.5,
    quantity: 10,
    expiry: "2025-05-25",
  },
  {
    id: 2,
    code: "SGR002",
    name: "Gulaku Sugar",
    price: 2.0,
    quantity: 5,
    expiry: "2050-11-15",
  },
  {
    id: 3,
    code: "MLK003",
    name: "Ultra Milk",
    price: 3.3,
    quantity: 0,
    expiry: "2030-04-11",
  },
];

function App() {
  const [products, setProducts] = useState(initialProducts);

  return (
    <>
      <CssBaseline />
      <Box
        sx={{
          backgroundColor: "#f7f4ea",
          minHeight: "100vh",
          width: "100%",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: "auto",
          padding: { xs: 1, sm: 2 },
        }}
      >
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <ProductList products={products} setProducts={setProducts} />
              }
            />
            <Route
              path="/add"
              element={
                <ProductForm products={products} setProducts={setProducts} />
              }
            />
            <Route
              path="/edit/:id"
              element={
                <ProductForm products={products} setProducts={setProducts} />
              }
            />
          </Routes>
        </Router>
      </Box>
    </>
  );
}

export default App;
