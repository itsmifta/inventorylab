import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ProductList from "./components/ProductList";
import ProductForm from "./components/ProductForm";
import PurchaseOrderList from "./components/PurchaseOrderList";
import SalesOrderList from "./components/SalesOrderList";
import Login from "./components/Login";
import { Box, CssBaseline, ThemeProvider, createTheme } from "@mui/material";

// Create a custom theme with dark purple focus color
const theme = createTheme({
  palette: {
    primary: {
      main: "#6a0dad", // Dark purple color for primary elements
    },
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#6a0dad", // Dark purple border when focused
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#5a0b9d", // Slightly darker on hover
          },
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          "&.Mui-focused": {
            color: "#6a0dad", // Dark purple label when focused
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          "&.Mui-checked": {
            color: "#6a0dad", // Dark purple for checked checkboxes
          },
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          "&.Mui-checked": {
            color: "#6a0dad", // Dark purple for selected radio buttons
          },
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          "&.Mui-checked": {
            color: "#6a0dad", // Dark purple for active switches
            "& + .MuiSwitch-track": {
              backgroundColor: "#6a0dad",
            },
          },
        },
      },
    },
  },
});

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

// Initial purchase orders data
const initialPurchaseOrders = [
  {
    id: 1,
    receivedDate: new Date("2025-05-20"),
    distributor: "Indofood Inc.",
    totalCost: 2500.0,
    status: "Cancelled",
    products: [
      {
        productId: 1,
        name: "Indomie Instant Noodles",
        quantity: 100,
        costPerUnit: 10.0,
      },
      { productId: 2, name: "Gulaku Sugar", quantity: 150, costPerUnit: 10.0 },
    ],
  },
  {
    id: 2,
    receivedDate: new Date("2025-05-22"),
    distributor: "Multi Food Ltd",
    totalCost: 3750.0,
    status: "Completed",
    products: [
      { productId: 3, name: "Ultra Milk", quantity: 50, costPerUnit: 25.0 },
      {
        productId: 1,
        name: "Indomie Instant Noodles",
        quantity: 100,
        costPerUnit: 25.0,
      },
    ],
  },
];

// Initial sales orders data
const initialSalesOrders = [
  {
    id: 1,
    orderDate: new Date("2025-05-23"),
    customer: "ABC Food",
    totalAmount: 1000.0,
    status: "Completed",
    products: [
      {
        productId: 1,
        name: "Indomie Instant Noodles",
        quantity: 10,
        pricePerUnit: 2.0,
      },
      {
        productId: 2,
        name: "Gulaku Sugar",
        quantity: 5,
        pricePerUnit: 3.0,
      },
    ],
  },
  {
    id: 2,
    orderDate: new Date("2025-05-24"),
    customer: "XYZ Customer",
    totalAmount: 1500.0,
    status: "Pending",
    products: [
      {
        productId: 3,
        name: "Ultra Milk",
        quantity: 10,
        pricePerUnit: 5.0,
      },
      {
        productId: 1,
        name: "Indomie Instant Noodles",
        quantity: 20,
        pricePerUnit: 2.5,
      },
    ],
  },
];

function App() {
  const [products, setProducts] = useState(initialProducts);
  const [purchaseOrders, setPurchaseOrders] = useState(initialPurchaseOrders);
  const [salesOrders, setSalesOrders] = useState(initialSalesOrders);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already authenticated (from localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem("inventoryLabUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Handle login
  const handleLogin = (userData) => {
    // Store user data in state and localStorage
    setUser(userData);
    localStorage.setItem("inventoryLabUser", JSON.stringify(userData));
  };

  // Handle logout
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("inventoryLabUser");
  };

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    if (loading) return null; // Show nothing while checking authentication
    if (!user) return <Navigate to="/login" replace />;
    return children;
  };

  return (
    <ThemeProvider theme={theme}>
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
          display: "flex", // Added flex display
        }}
      >
        <Router>
          <Routes>
            <Route
              path="/login"
              element={
                !user ? (
                  <Login onLogin={handleLogin} />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Box sx={{ display: "flex", width: "100%" }}>
                    <ProductList
                      products={products}
                      setProducts={setProducts}
                      onLogout={handleLogout}
                      user={user}
                    />
                  </Box>
                </ProtectedRoute>
              }
            />
            <Route
              path="/add"
              element={
                <ProtectedRoute>
                  <Box sx={{ display: "flex", width: "100%" }}>
                    <ProductForm
                      products={products}
                      setProducts={setProducts}
                      onLogout={handleLogout}
                      user={user}
                    />
                  </Box>
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit/:id"
              element={
                <ProtectedRoute>
                  <Box sx={{ display: "flex", width: "100%" }}>
                    <ProductForm
                      products={products}
                      setProducts={setProducts}
                      onLogout={handleLogout}
                      user={user}
                    />
                  </Box>
                </ProtectedRoute>
              }
            />
            <Route
              path="/purchase-orders"
              element={
                <ProtectedRoute>
                  <Box sx={{ display: "flex", width: "100%" }}>
                    <PurchaseOrderList
                      purchaseOrders={purchaseOrders}
                      setPurchaseOrders={setPurchaseOrders}
                      products={products}
                      setProducts={setProducts}
                      onLogout={handleLogout}
                      user={user}
                    />
                  </Box>
                </ProtectedRoute>
              }
            />
            <Route
              path="/sales-orders"
              element={
                <ProtectedRoute>
                  <Box sx={{ display: "flex", width: "100%" }}>
                    <SalesOrderList
                      salesOrders={salesOrders}
                      setSalesOrders={setSalesOrders}
                      products={products}
                      setProducts={setProducts}
                      onLogout={handleLogout}
                      user={user}
                    />
                  </Box>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </Box>
    </ThemeProvider>
  );
}

export default App;
