'use client';
import AdminSidebar from '../../components/Admin/AdminSidebar';
import AdminHeader from '../../components/Admin/AdminHeader';
import { Box, Toolbar } from '@mui/material';
import { useEffect, useState } from 'react';

import '../../globals.css';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from '@/stores/authStore';
import RoleGuard from '@/HOC/withRoleGuardComponent';
import { AllowedRoleForAdminLayout } from '@/constant/AllowedRole/Admin.allowed-role';
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    if (useAuthStore.persist.hasHydrated()) {
      setHasHydrated(true);
    } else {
      const unsub = useAuthStore.persist.onHydrate(() => {
        setHasHydrated(true);
      });
      useAuthStore.persist.rehydrate();
      return unsub;
    }
  }, []);

  return (
    <html suppressHydrationWarning>
      <body>
        {hasHydrated ? (
          <>
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
          </>
        ) : null}
      </body>
    </html>
  );
}
