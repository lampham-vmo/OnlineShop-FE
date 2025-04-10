"use client";

import React, { useEffect, useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import { useRouter } from "next/navigation";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isClient, setIsClient] = useState(false);
  const [error, setError] = useState<string>("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log(data);
      if (!response.ok) {
        let errorMessage = "";
        let errorMessageArray;
        if (Array.isArray(data.error.message)) {
          errorMessageArray = data.error.message;
        } else {
          errorMessageArray = [data.error.message];
        }

        errorMessage = errorMessageArray
          .map((content: string) => {
            switch (content) {
              case "email should not be empty":
                return "email should not be empty";
                break;
              case "email must be an email":
                return "email must be an email";
                break;
              case "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character":
                return "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character";
                break;
              case "password must be longer than or equal to 4 characters":
                return "password must be longer than or equal to 4 characters";
                break;
              case "password should not be empty":
                return "password should not be empty";
                break;
              case "password not match!":
                return "password not match!";
                break;
              case "user not found!":
                return "user not found!";
                break;
              default:
                return content;
                break;
            }
          })
          .join("\n");

        setError(errorMessage);
        setOpenSnackbar(true);
        return;
      }

      // Lưu tokens vào localStorage
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);

      // Chuyển hướng sau khi đăng nhập thành công
      router.push("/"); // hoặc trang bạn muốn chuyển hướng đến
    } catch (err) {
      setError("Có lỗi xảy ra, vui lòng thử lại sau");
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient ? (
    <>
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ padding: 4, mt: 10 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Log in
          </Typography>
          <Box component="form" onSubmit={handleLogin} noValidate>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              required
              margin="normal"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="password"
              variant="outlined"
              type="password"
              fullWidth
              required
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Log in
            </Button>
          </Box>
        </Paper>
      </Container>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error">
          <Typography sx={{ whiteSpace: "pre-line" }}>
            {error}
          </Typography>
        </Alert>
      </Snackbar>
    </>
  ) : (
    "loading..."
  );
};

export default LoginPage;
