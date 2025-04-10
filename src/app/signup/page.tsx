'use client'

import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Grid,
  Alert,
  Snackbar,
} from '@mui/material'
import { useState } from 'react'
import api from '../../../lib/api'

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
  })

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [openError, setOpenError] = useState(false)
  const [openSuccess, setOpenSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const validate = () => {
    const {
      fullname,
      email,
      password,
      confirmPassword,
      phone,
      address,
    } = formData

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

    if (!fullname || fullname.length > 20) {
      return 'Full name is required and must be less than 20 characters.'
    }

    if (!email || !email.includes('@')) {
      return 'Valid email is required.'
    }

    if (
      !password ||
      password.length < 4 ||
      password.length > 20 ||
      !passwordRegex.test(password)
    ) {
      return 'Password must be 8+ chars, with uppercase, lowercase, number, and special char.'
    }

    if (confirmPassword !== password) {
      return 'Confirm password must match password.'
    }

    if (!phone || !/^\d{10,11}$/.test(phone)) {
      return 'Phone number must be 10-11 digits and numbers only.'
    }

    if (!address || address.length > 20) {
      return 'Address is required and must be less than 20 characters.'
    }

    return ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validationError = validate()

    if (validationError) {
      setError(validationError)
      setOpenError(true)
      setSuccess('')
      return
    }

    try {
      const res = await api.post('/auth/signup', formData)
      console.log('Success:', res.data)
      setSuccess('Account created successfully!')
      setOpenSuccess(true)
      setError('')
      window.location.href = '/login'
    } catch (err: any) {
      console.error(err)
      const message =
        err.response?.data?.message || 'Something went wrong during sign up'
      setError(message)
      setOpenError(true)
      setSuccess('')
    }
  }

  return (
    <Container maxWidth="sm">
      <Box mt={8} p={4} boxShadow={3} borderRadius={2}>
        <Typography variant="h4" gutterBottom textAlign="center">
          Sign Up
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {[
              { label: 'Full Name', name: 'fullname' },
              { label: 'Email', name: 'email', type: 'email' },
              { label: 'Password', name: 'password', type: 'password' },
              {
                label: 'Confirm Password',
                name: 'confirmPassword',
                type: 'password',
              },
              { label: 'Phone', name: 'phone' },
              { label: 'Address', name: 'address' },
            ].map(({ label, name, type = 'text' }) => (
              <Grid size={12} key={name}>
                <TextField
                  fullWidth
                  label={label}
                  name={name}
                  type={type}
                  value={formData[name as keyof typeof formData]}
                  onChange={handleChange}
                  required
                />
              </Grid>
            ))}

            <Grid size={12}>
              <Button fullWidth variant="contained" type="submit">
                Sign Up
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>

      {/* 🔔 Snackbar for Errors */}
      <Snackbar
        open={openError}
        autoHideDuration={4000}
        onClose={() => setOpenError(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setOpenError(false)}
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>

      {/* ✅ Snackbar for Success */}
      <Snackbar
        open={openSuccess}
        autoHideDuration={4000}
        onClose={() => setOpenSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setOpenSuccess(false)}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {success}
        </Alert>
      </Snackbar>
    </Container>
  )
}
