'use client';

import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Toolbar,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InventoryIcon from '@mui/icons-material/Inventory';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import GroupIcon from '@mui/icons-material/Group';

import { useRouter, usePathname } from 'next/navigation';

const menuItems = [
  { label: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
  { label: 'Orders', icon: <ShoppingCartIcon />, path: '/admin/order' },
  { label: 'Products', icon: <InventoryIcon />, path: '/admin/product' },
  { label: 'Users', icon: <GroupIcon />, path: '/admin/user' },
  { label: 'Roles', icon: <AdminPanelSettingsIcon />, path: '/admin/role' },
];

const drawerWidth = 240;

export default function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {menuItems.map((item) => (
            <ListItemButton
              key={item.label}
              selected={pathname === item.path}
              onClick={() => router.push(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}
