'use client';

import { useAuthStore } from '@/stores/authStore';
import {
  AppBar,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  Box,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AdminHeader() {
  const { user, clearTokens } = useAuthStore();
  const router = useRouter();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // TODO: logout logic
    // await authControllerLogout();
    clearTokens();
    router.push('/signin');
  };

  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6" noWrap component="div">
          Admin Dashboard
        </Typography>

        <Box>
          <div
            className="w-10 h-10 rounded-full text-white transition-all duration-300 bg-gray-5 hover:bg-white hover:text-dark flex items-center justify-center cursor-pointer"
            onClick={handleMenuOpen}
          >
            {user?.email[0].toUpperCase()}
          </div>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem
              onClick={() => {
                handleMenuClose();
                router.push('/profile');
              }}
            >
              Profile
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleMenuClose();
                handleLogout();
              }}
            >
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
