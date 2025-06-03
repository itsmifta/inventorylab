import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Alert,
  Container,
  Fade,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  PersonOutline,
  Lock,
  Science as ScienceIcon,
} from "@mui/icons-material";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // Simulating authentication with hardcoded credentials
  const handleLogin = (e) => {
    e.preventDefault();

    // Reset error
    setError("");

    // Validate credentials
    if (username === "admin" && password === "inventorylab") {
      // Call the login callback with the authenticated user
      onLogin({ username });
    } else {
      setError("Invalid username or password. Please try again.");
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{ height: "100vh", display: "flex", alignItems: "center" }}
    >
      <Paper
        elevation={8}
        sx={{
          width: "100%",
          p: 4,
          borderRadius: 2,
          background: "linear-gradient(145deg, #ffffff, #f0f0f0)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 600,
                color: "#2c3e50",
                letterSpacing: "0.5px",
              }}
            >
              InventoryLab
            </Typography>
            <ScienceIcon
              sx={{
                fontSize: "3rem",
                color: "#6a0dad", // Changed to darker purple from #2196f3
                transform: "rotate(25deg)",
                transition: "transform 0.3s ease-in-out",
                "&:hover": {
                  transform: "rotate(45deg) scale(1.1)",
                },
              }}
            />
          </Box>
          <Typography
            variant="h6"
            sx={{
              color: "#7f8c8d",
              fontWeight: 400,
              textAlign: "center",
            }}
          >
            Login to manage your inventory
          </Typography>
        </Box>

        {error && (
          <Fade in={!!error}>
            <Alert
              severity="error"
              sx={{ mb: 3, borderRadius: 1 }}
              onClose={() => setError("")}
            >
              {error}
            </Alert>
          </Fade>
        )}

        <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            inputProps={{
              "data-testid": "username-input",
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutline color="primary" />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 3 }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            data-testid="password-input"
            type={showPassword ? "text" : "password"}
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            inputProps={{
              "data-testid": "password-input",
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock color="primary" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    data-testid="toggle-password-visibility"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 4 }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            data-testid="login-button"
            sx={{
              mt: 1,
              mb: 2,
              py: 1.5,
              borderRadius: 2,
              fontWeight: 600,
              boxShadow: "0 4px 10px rgba(106, 13, 173, 0.3)",
              background: "linear-gradient(45deg, #6a0dad 30%, #9932cc 90%)",
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: "0 6px 15px rgba(106, 13, 173, 0.4)",
                transform: "translateY(-2px)",
              },
            }}
          >
            SIGN IN
          </Button>

          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontStyle: "italic" }}
            >
              Use credentials: admin / inventorylab
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default Login;
