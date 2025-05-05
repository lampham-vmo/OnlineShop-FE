'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  Box,
  Button,
  Paper,
  TextField,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authControllerConfirmResetPasswordTokenBody } from '@/generated/api/schemas/auth/auth.zod';
import { getAuth } from '@/generated/api/endpoints/auth/auth';
import { useAuthStore } from '@/stores/authStore';

const { authControllerConfirmEmail, authControllerConfirmResetPasswordToken } =
  getAuth();

export const VerifyEmail = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const user = useAuthStore((state) => state.user);
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading',
  );

  useEffect(() => {
    if (!token || typeof token !== 'string') return;

    const verify = async () => {
      try {
        await authControllerConfirmEmail(token);
        setStatus('success');
      } catch (err) {
        console.log(err);
        setStatus('error');
      }
    };

    verify();
  }, [token]);

  if (!token) {
    if (!user) {
      window.location.href = '/signin';
    } else {
      window.location.href = '/';
    }
    return null;
  }

  return (
    <Container
      maxWidth="sm"
      sx={{ mt: 8, display: 'flex', justifyContent: 'center' }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          width: '100%',
          textAlign: 'center',
          borderRadius: 2,
          backgroundColor: '#f9f9f9',
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: 'bold', color: '#1976d2' }}
        >
          Account Verification
        </Typography>

        {status === 'loading' && (
          <Box sx={{ mt: 4 }}>
            <CircularProgress />
            <Typography variant="body1" sx={{ mt: 2, color: '#555' }}>
              Verifying your link...
            </Typography>
          </Box>
        )}

        {status === 'success' && (
          <Alert
            severity="success"
            sx={{
              mt: 4,
              fontSize: '1rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 2 }}>
              Your account has been successfully verified.
            </Typography>
            <Box mt={3}>
              <Button
                variant="contained"
                color="primary"
                href="/signin"
                sx={{ fontWeight: 'bold' }}
              >
                Sign in now
              </Button>
            </Box>
          </Alert>
        )}

        {status === 'error' && (
          <Alert severity="error" sx={{ mt: 4, fontSize: '1rem' }}>
            Verification failed. The link may have expired or is invalid.
          </Alert>
        )}
      </Paper>
    </Container>
  );
};

const ResetPasswordForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const user = useAuthStore((state) => state.user);

  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');

  const schema = authControllerConfirmResetPasswordTokenBody;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  if (!token) {
    if (!user) {
      window.location.href = '/signin';
    } else {
      window.location.href = '/';
    }
    return null;
  }
  const onSubmit = async (data: z.infer<typeof schema>) => {
    setStatus('loading');
    try {
      await authControllerConfirmResetPasswordToken(token, data);
      setStatus('success');
    } catch (err) {
      console.log(err);
      setStatus('error');
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{ mt: 8, display: 'flex', justifyContent: 'center' }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          width: '100%',
          textAlign: 'center',
          borderRadius: 2,
          backgroundColor: '#f9f9f9',
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: 'bold', color: '#1976d2' }}
        >
          Reset Password
        </Typography>

        {status === 'loading' && (
          <Box sx={{ mt: 4 }}>
            <CircularProgress />
            <Typography variant="body1" sx={{ mt: 2, color: '#555' }}>
              Resetting your password...
            </Typography>
          </Box>
        )}

        {status === 'success' && (
          <Alert
            severity="success"
            sx={{
              mt: 4,
              fontSize: '1rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 2 }}>
              Your password has been successfully reset.
            </Typography>
            <Box mt={3}>
              <Button
                variant="contained"
                color="primary"
                href="/signin"
                sx={{ fontWeight: 'bold' }}
              >
                Sign in now
              </Button>
            </Box>
          </Alert>
        )}

        {status === 'error' && (
          <Alert severity="error" sx={{ mt: 4, fontSize: '1rem' }}>
            Reset failed. The link may have expired or is invalid.
          </Alert>
        )}

        {status === 'idle' && (
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <TextField
              label="Confirm Password"
              type="password"
              fullWidth
              margin="normal"
              {...register('confirmPassword')}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2, fontWeight: 'bold' }}
            >
              Reset Password
            </Button>
          </form>
        )}
      </Paper>
    </Container>
  );
};

export default ResetPasswordForm;
