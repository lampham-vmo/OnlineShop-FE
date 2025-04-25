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
  CircularProgress,
  Modal,
} from '@mui/material';
import { Visibility, VisibilityOff, CheckCircle, Replay } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { getAuth } from '@/generated/api/endpoints/auth/auth';
import { authControllerLoginBody } from '@/generated/api/schemas/auth/auth.zod';
import type { LoginUserDTO } from '@/generated/api/models';
import { useAuthStore, type AuthState } from '@/stores/authStore';
import { jwtDecode } from 'jwt-decode';
import ResetPasswordForm from "../VerifyResetToken";

// Use the Orval-generated zod schema
const loginSchema = authControllerLoginBody;

// Infer TypeScript type from schema
type LoginFormData = LoginUserDTO;

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailNotVerified, setEmailNotVerified] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [resendStatus, setResendStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [openResetPasswordModal, setOpenResetPasswordModal] = useState(false);
  const authApi = getAuth();

  const { user, setTokens, setPermission } = useAuthStore.getState();
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
      setEmailNotVerified(false);
      const response = await authApi.authControllerLogin(data);
      const result = response.data;

      // Sử dụng authStore để lưu tokens
      setPermission(result.permission);
      console.log(result)
      setTokens({
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      });

      // Redirect sau khi đăng nhập thành công
      const payload: any = jwtDecode(result.accessToken);
      if (payload.role == 1) {
        router.push('/admin');
      } else {
        router.push('/');
      }

    } catch (err: any) {
      console.log(err);
      setError(
        err.message || 'Login failed. Please try again.',
      );
      if (err.message === 'email not verified!') {
        setEmailNotVerified(true);
        setEmail(data.email); // Save the email for resending confirmation
      }
    }
  };

  const handleResendConfirmationEmail = async () => {
    if (!email) return;
    setResendStatus('loading');
    try {
      await authApi.authControllerReSendConfirmationEmail(email);
      setResendStatus('success');
    } catch (err: any) {
      alert('Failed to resend confirmation email: ' + err.message);
      setResendStatus('idle');
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

          {emailNotVerified && (
            <Box
              sx={{
                marginTop: 2,
                padding: 2,
                border: '1px solid black',
                borderRadius: 2,
                textAlign: 'center',
              }}
            >
              {resendStatus === 'success' ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircle color="success" />
                  <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    Confirmation email resent successfully!
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={handleResendConfirmationEmail}
                    >
                      <Replay fontSize="small" />
                    </IconButton>
                  </Typography>
                </Box>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleResendConfirmationEmail}
                  disabled={resendStatus === 'loading'}
                  startIcon={resendStatus === 'loading' ? <CircularProgress size={20} /> : null}
                >
                  {resendStatus === 'loading' ? 'Resending...' : 'Click here to resend confirmation email'}
                </Button>
              )}
            </Box>
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
            <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Forget password? <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setOpenResetPasswordModal(true);
                }}
                style={{ textDecoration: "none", color: "#1976d2" }}
              >
                Click here
              </a>
            </Typography>
          </Box>
        </Paper>
      </Box>
      <Modal
        open={openResetPasswordModal}
        onClose={() => setOpenResetPasswordModal(false)}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <ResetPasswordForm />
        </Box>
      </Modal>
    </Container>
  );
}
