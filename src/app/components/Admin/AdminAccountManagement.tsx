'use client'

import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Grid,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { useEffect, useState } from 'react'
import { getUsers } from '@/generated/api/endpoints/users/users'

const { userControllerFindAll, userControllerDelete, userControllerUpdateUserRole } = getUsers()

type GetUserAccountDTO = {
  id: number
  fullname: string
  email: string
  roleName: string
  status: boolean
  createdAt: string
}

export default function AccountPage() {
  const [accounts, setAccounts] = useState<GetUserAccountDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(null)
  const [editAccountId, setEditAccountId] = useState<number | null>(null)
  const [selectedRoleId, setSelectedRoleId] = useState<number>(2)
  const [editDialogOpen, setEditDialogOpen] = useState(false)


  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await userControllerFindAll()
        setAccounts(res.data.accounts) // NOTE: change this if your data shape differs
      } catch (err) {
        console.error('Failed to fetch accounts:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAccounts()
  }, [])

  const handleEdit = (id: number) => {
    const account = accounts.find((a) => a.id === id)
    if (!account) return
    setEditAccountId(id)
    setSelectedRoleId(account.roleName === 'Admin' ? 1 : 2) // adjust mapping logic
    setEditDialogOpen(true)
  }

  const handleConfirmDelete = (id: number) => {
    setSelectedAccountId(id)
    setOpenDialog(true)
  }

  const handleDelete = async () => {
    if (!selectedAccountId) return
    try {
      await userControllerDelete(String(selectedAccountId))
      setAccounts((prev) => prev.filter((a) => a.id !== selectedAccountId))
    } catch (err) {
      console.error('Failed to delete account:', err)
    } finally {
      setOpenDialog(false)
      setSelectedAccountId(null)
    }
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Account Management
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Full Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {accounts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No accounts found.
                </TableCell>
              </TableRow>
            ) : (
              accounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell>{account.fullname}</TableCell>
                  <TableCell>{account.email}</TableCell>
                  <TableCell>{account.roleName}</TableCell>
                  <TableCell>{account.status ? 'Active' : 'Inactive'}</TableCell>
                  <TableCell>{new Date(account.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Edit">
                      <IconButton onClick={() => handleEdit(account.id)} color="primary">
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton onClick={() => handleConfirmDelete(account.id)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this account? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Grid container spacing={2} justifyContent="flex-end" px={2} pb={2}>
            <Grid>
              <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            </Grid>
            <Grid>
              <Button onClick={handleDelete} color="error" variant="contained">
                Delete
              </Button>
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>

      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit User Role</DialogTitle>
        <DialogContent>
          <DialogContentText>Select a new role for this user.</DialogContentText>
          <Box mt={2}>
            <select
              value={selectedRoleId}
              onChange={(e) => setSelectedRoleId(Number(e.target.value))}
              style={{ width: '100%', padding: '8px', borderRadius: 4 }}
            >
              <option value={1}>Admin</option>
              <option value={2}>User</option>
            </select>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={async () => {
              if (!editAccountId) return
              try {
                await userControllerUpdateUserRole(String(editAccountId), {
                  role_id: selectedRoleId,
                })
                setAccounts((prev) =>
                  prev.map((acc) =>
                    acc.id === editAccountId
                      ? {
                        ...acc,
                        roleName: selectedRoleId === 1 ? 'Admin' : 'User',
                      }
                      : acc
                  )
                )
              } catch (err) {
                console.error('Failed to update role', err)
              } finally {
                setEditDialogOpen(false)
                setEditAccountId(null)
              }
            }}
            variant="contained"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  )
}
