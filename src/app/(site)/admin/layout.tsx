'use client';
import AdminSidebar from '../../components/Admin/AdminSidebar';
import AdminHeader from '../../components/Admin/AdminHeader';
import { Box, Toolbar } from '@mui/material';
import { useEffect } from 'react';

import '../../globals.css';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from '@/stores/authStore';
import { Roles } from '@/constant/roles';
import RoleGuard from '@/HOC/withRoleGuardComponent';
import { AllowedRoleForAdminLayout } from '@/constant/AllowedRole/Admin.allowed-role';
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <body>
        <RoleGuard allowedRoles={AllowedRoleForAdminLayout}>
          <Box sx={{ display: 'flex' }}>
            <AdminSidebar />
            <Box component="main" sx={{ flexGrow: 1 }}>
              <AdminHeader />
              <Toolbar /> {/* Pushes content below header */}
              <Box p={3}>{children}</Box>
            </Box>
          </Box>
        </RoleGuard>

        <Toaster />
      </body>
    </html>
  );
}
