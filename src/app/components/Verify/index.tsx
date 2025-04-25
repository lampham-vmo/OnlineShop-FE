"use client"
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
} from '@mui/material';
import { getAuth } from '@/generated/api/endpoints/auth/auth';
import { useAuthStore } from '@/stores/authStore';

const { authControllerConfirmEmail,  authControllerConfirmResetPasswordToken} = getAuth();

const VerifyEmail = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const user = useAuthStore((state) => state.user);

  if (!token) {
    if (!user) {
      window.location.href = '/signin';
    } else {
      window.location.href = '/';
    }
    return null;
  }

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    if (!token || typeof token !== 'string') return;

    const verify = async () => {
      try {
        const res = await authControllerConfirmEmail(token);
        setStatus('success');
      } catch (err) {
        console.log(err);
        setStatus('error');
      }
    };

    verify();
  }, [token]);

  return (
    <Container maxWidth="sm" sx={{ mt: 8, display: 'flex', justifyContent: 'center' }}>
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
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
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
          <Alert severity="success" sx={{ mt: 4, fontSize: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 2 }}>
              Your account has been successfully verified.
            </Typography>
            <Box mt={3}>
              <Button variant="contained" color="primary" href="/signin" sx={{ fontWeight: 'bold' }}>
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

export const VerifyConfirmResetPassword = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const user = useAuthStore((state) => state.user);

  if (!token) {
    if (!user) {
      window.location.href = '/signin';
    } else {
      window.location.href = '/';
    }
    return null;
  }

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    if (!token || typeof token !== 'string') return;

    const verify = async () => {
      try {
        const res = await authControllerConfirmResetPasswordToken(token);
        setStatus('success');
      } catch (err) {
        console.log(err);
        setStatus('error');
      }
    };

    verify();
  }, [token]);

  return (
    <Container maxWidth="sm" sx={{ mt: 8, display: 'flex', justifyContent: 'center' }}>
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
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          Reset Password
        </Typography>

        {status === 'loading' && (
          <Box sx={{ mt: 4 }}>
            <CircularProgress />
            <Typography variant="body1" sx={{ mt: 2, color: '#555' }}>
              resetting your password...
            </Typography>
          </Box>
        )}

        {status === 'success' && (
          <Alert severity="success" sx={{ mt: 4, fontSize: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 2 }}>
              Your account's password has been successfully resetted.
            </Typography>
            <Box mt={3}>
              <Button variant="contained" color="primary" href="/signin" sx={{ fontWeight: 'bold' }}>
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
      </Paper>
    </Container>
  );
}

export default VerifyEmail;
