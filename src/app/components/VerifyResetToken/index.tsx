'use client';
import { useState } from 'react';
import { Container, CircularProgress, Alert, Button } from '@mui/material';
import { getAuth } from '@/generated/api/endpoints/auth/auth';
import { authControllerResetPasswordBody } from '@/generated/api/schemas/auth/auth.zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextField, Snackbar } from '@mui/material';

const { authControllerResetPassword } = getAuth();

const SendResetPasswordForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(authControllerResetPasswordBody),
    defaultValues: {
      email: '',
    },
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [severity, setSeverity] = useState<'success' | 'error'>('success');

  const onSubmit = async (data: { email: string }) => {
    setLoading(true);
    setMessage(null);
    try {
      const response = await authControllerResetPassword(data);
      if (response.success) {
        setSeverity('success');
        setMessage('Reset password link sent successfully!');
      } else {
        setSeverity('error');
        setMessage('Failed to send reset password link.');
      }
      /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error: any) {
      setSeverity('error');
      setMessage(error.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="Email"
              error={!!errors.email}
              helperText={errors.email?.message}
              sx={{ mb: 2 }}
            />
          )}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Send Reset Password Link'
          )}
        </Button>
      </form>
      {message && (
        <Snackbar
          open={!!message}
          autoHideDuration={6000}
          onClose={() => setMessage(null)}
        >
          <Alert
            onClose={() => setMessage(null)}
            severity={severity}
            sx={{ width: '100%' }}
          >
            {message}
          </Alert>
        </Snackbar>
      )}
    </Container>
  );
};

export default SendResetPasswordForm;
