'use client'

import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Toolbar,
  CircularProgress,
} from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import InventoryIcon from '@mui/icons-material/Inventory'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import GroupIcon from '@mui/icons-material/Group'
import CategoryIcon from '@mui/icons-material/Category'
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Permission } from '@/generated/api/models'
import { getPermission } from '@/generated/api/endpoints/permission/permission'

const drawerWidth = 240

const menuItems = [
  { label: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
  { label: 'Orders', icon: <ShoppingCartIcon />, path: '/admin/order' },
  { label: 'Categories', icon: <CategoryIcon />, path: '/admin/category' },
  { label: 'Products', icon: <InventoryIcon />, path: '/admin/products' },
  { label: 'Users', icon: <GroupIcon />, path: '/admin/user' },
  { label: 'Roles', icon: <AdminPanelSettingsIcon />, path: '/admin/role' },
]

export default function AdminSidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const [permissionList, setPermissionList] = useState<Permission[]>([])
  const [loading, setLoading] = useState(true)

  const { permissionControllerFindAll } = getPermission()

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const res = await permissionControllerFindAll()
        setPermissionList(res.data)
      } catch (error) {
        console.error('Failed to fetch permissions:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPermissions()
  }, [])

  const hasPermission = (path: string): boolean => {
    return permissionList.some((perm) => perm.path === path)
  }

  const filteredMenuItems = menuItems.filter((item) => hasPermission(item.path))

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
        {loading ? (
          <Box display="flex" justifyContent="center" mt={2}>
            <CircularProgress size={24} />
          </Box>
        ) : (
          <List>
            {filteredMenuItems.map((item) => (
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
        )}
      </Box>
    </Drawer>
  )
}
