"use client";
import AdminSidebar from '../../components/Admin/AdminSidebar';
import AdminHeader from '../../components/Admin/AdminHeader';
import { Box, Toolbar } from '@mui/material';
import { useEffect } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  useEffect(() => {
      // Initialize any necessary state or perform side effects here  
  },[]);




  return (
    <html>
      <body>
        <Box sx={{ display: 'flex' }}>
          <AdminSidebar />
          <Box component="main" sx={{ flexGrow: 1 }}>
            <AdminHeader />
            <Toolbar /> {/* Pushes content below header */}
            <Box p={3}>{children}</Box>
          </Box>
        </Box>
      </body>
    </html>
  );
}
