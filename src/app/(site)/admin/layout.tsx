import AdminSidebar from '../../components/Admin/AdminSidebar'
import AdminHeader from '../../components/Admin/AdminHeader'
import { Box, Toolbar } from '@mui/material'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
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
   
  )
}
