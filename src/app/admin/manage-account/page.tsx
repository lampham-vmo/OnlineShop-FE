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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from 'next/navigation';
import axios from 'axios';
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

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await api.get('/users');
      console.log(response);
      setAccounts(response.data.accounts);
    } catch (error) {
      console.error('Failed to fetch accounts:', error);
    }
  };

  const handleAddRole = () => {
    router.push('/admin/manage-account/role');
  };

  const handleEditAccount = (id: number) => {
    // Implement edit functionality
    console.log('Edit account:', id);
  };

  const handleDeleteAccount = async (id: number) => {
    try {
      await axios.delete(`/api/accounts/${id}`);
      fetchAccounts();
    } catch (error) {
      console.error('Failed to delete account:', error);
    }
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
                <TableCell>Actions</TableCell>
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
                      label={account.status === true ? 'Active' : 'Inactive'} 
                      color={account.status === true ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{new Date(account.createdAt).toLocaleDateString('en-US')}</TableCell>
                  <TableCell>
                    <IconButton 
                      size="small" 
                      onClick={() => handleEditAccount(account.id)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      onClick={() => handleDeleteAccount(account.id)}
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
    </Box>
  );
};

export default ManageAccountPage;
