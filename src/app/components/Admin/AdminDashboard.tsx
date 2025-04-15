'use client'

import { Box, Typography, Container, Paper } from '@mui/material'

export default function AdminDashboardMain() {
  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 8, borderRadius: 3 }}>
        <Typography variant="h4" gutterBottom>
          Welcome, Admin 👋
        </Typography>
        <Typography variant="body1" color="text.secondary">
          This is your dashboard. From here, you can manage users, view reports, and control system settings.
        </Typography>
      </Paper>
    </Container>
  )
}
