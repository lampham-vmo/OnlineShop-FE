'use client';

import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Alert,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { z } from 'zod';
import { useState } from 'react';
import { useUserStore } from '@/stores/useUserStore';
import { authControllerCreateBody } from '@/generated/api/schemas/auth/auth.zod';
import { getAuth } from '@/generated/api/endpoints/auth/auth';

// Update the Zod schema to validate Gmail addresses
const gmailValidationSchema = authControllerCreateBody.extend({
  email: z
    .string()
    .email('Invalid email address')
    .refine((email) => email.endsWith('@gmail.com'), {
      message: 'Only Gmail addresses are allowed',
    }),
});

type FormData = z.infer<typeof gmailValidationSchema>;

export default function SignUpForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(gmailValidationSchema), // Use the updated schema
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state
  const setUser = useUserStore((state) => state.setUser);

  const onSubmit = async (data: FormData) => {
    setLoading(true); // Set loading to true when submission starts
    try {
      const res = await getAuth().authControllerCreate(data);
      setUser(res.data);
      setSuccess(
        'Account created successfully, please check your email to activate the account!',
      );
      setError('');
    } catch (err: any) {
      const message = err.message || 'Signup failed';
      console.log(message);
      setError(message);
      setSuccess('');
    } finally {
      setLoading(false); // Set loading to false after submission completes
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={8} p={4} boxShadow={3} borderRadius={2}>
        <Typography variant="h4" gutterBottom textAlign="center">
          Sign Up
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Full Name"
                {...register('fullname')}
                error={!!errors.fullname}
                helperText={errors.fullname?.message}
              />
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                label="Email"
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                label="Password"
                type="password"
                {...register('password')}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                label="Confirm Password"
                type="password"
                {...register('confirmPassword')}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
              />
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                label="Phone"
                {...register('phone')}
                error={!!errors.phone}
                helperText={errors.phone?.message}
              />
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                label="Address"
                {...register('address')}
                error={!!errors.address}
                helperText={errors.address?.message}
              />
            </Grid>

            <Grid size={12}>
              <Button
                fullWidth
                variant="contained"
                type="submit"
                disabled={loading || !!success} // Disable button if loading or success
              >
                {loading ? 'Loading...' : success ? 'Success!' : 'Sign Up'}
              </Button>
            </Grid>
            {/* Add the "Already have an account? Sign in" text */}
            <Grid size={12}>
              <Typography variant="body2" align="center">
                Already have an account?{' '}
                <a
                  href="/signin"
                  style={{ textDecoration: 'none', color: '#1976d2' }}
                >
                  Sign in
                </a>
              </Typography>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
  );
}
