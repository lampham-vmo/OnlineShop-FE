'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Box,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from 'next/navigation';
import api from '../../../../lib/api';

interface Account {
  id: number;
  fullName: string;
  email: string;
  role: string;
  status: boolean;
  createdAt: Date;
}

const ManageAccountPage = () => {
  const router = useRouter();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(null);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await api.get('/users');
      setAccounts(response.data.accounts);
    } catch (error) {
      console.error('Failed to fetch accounts:', error);
    }
  };

  const handleAddRole = () => {
    router.push('/admin/manage-account/role');
  };

  const handleDeleteClick = (id: number) => {
    setSelectedAccountId(id);
    setOpenDialog(true);
  };

  const confirmDelete = async () => {
    if (selectedAccountId === null) return;

    try {
      await api.delete(`/users/${selectedAccountId}`);
      fetchAccounts();
    } catch (error) {
      console.error('Failed to delete account:', error);
    } finally {
      setOpenDialog(false);
      setSelectedAccountId(null);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedAccountId(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" component="h2">
            Account Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddRole}
          >
            Add Role
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Fullname</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Remove accounts</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {accounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell>{account.fullName}</TableCell>
                  <TableCell>{account.email}</TableCell>
<TableCell>{account.role}</TableCell>
                  <TableCell>
                    <Chip 
                      label={account.status ? 'Active' : 'Inactive'} 
                      color={account.status ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{new Date(account.createdAt).toLocaleDateString('en-US')}</TableCell>
                  <TableCell>
                    <IconButton 
                      size="small" 
                      onClick={() => handleDeleteClick(account.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Confirm Delete Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this account?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageAccountPage;