'use client';

import { use, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Container,
  InputAdornment,
  IconButton,
  Alert,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { getAuth } from '@/generated/api/endpoints/auth/auth';
import { authControllerLoginBody } from '@/generated/api/schemas/auth/auth.zod';
import type { LoginUserDTO } from '@/generated/api/models';
import { useAuthStore, type AuthState } from '@/stores/authStore';

// Use the Orval-generated zod schema
const loginSchema = authControllerLoginBody;

// Infer TypeScript type from schema
type LoginFormData = LoginUserDTO;

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const authApi = getAuth();
  const setTokens = useAuthStore((state: AuthState) => state.setTokens);
  const setPermission = useAuthStore((state: AuthState) => state.setPermission);
  // Initialize react-hook-form with zod resolver
  // Check for authentication on component mount

  // useEffect(() => {
  //   const auth = localStorage.getItem('auth-storage'); // Adjust according to your auth key
  //   if (auth) {
  //     router.push('/'); // Navigate to home if authenticated
  //   }
  // }, [router]);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError(null);
      const response = await authApi.authControllerLogin(data);
      const result = response.data;

      // Sử dụng authStore để lưu tokens
      setPermission(result.permission);
      setTokens({
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      });

      // Redirect sau khi đăng nhập thành công
      router.push('/');
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Login failed. Please try again.',
      );
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
            Login
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ width: '100%' }}
          >
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  autoComplete="email"
                  autoFocus
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  margin="normal"
                  required
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="current-password"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </Button>
            {/* Add the signup link here */}
            <Typography variant="body2" align="center" sx={{ mt: 2 }}>
              Don't have an account?{' '}
              <a
                href="/signup"
                style={{ textDecoration: 'none', color: '#1976d2' }}
              >
                Sign up
              </a>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
