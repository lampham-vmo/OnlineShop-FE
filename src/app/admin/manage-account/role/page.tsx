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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Checkbox,
  FormControlLabel,
  Typography,
  Box,
  List,
  ListItem,
  IconButton,
  Modal,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useRouter } from 'next/navigation';
import api from '../../../../../lib/api';

interface Permission {
  id: string;
  name: string;
  path: string;
  method: string;
  description: string;
}

interface Role {
  id: string;
  name: string;
  permissions: Permission[];
}

const ManageAccountPage = () => {
  const router = useRouter();
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [roleName, setRoleName] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await api.get('/role')
      setRoles(response.data);
    } catch (error) {
      console.error('Failed to fetch roles:', error);
    }
  };

  const fetchPermissions = async () => {
    try {
      const response = await api.get('/permission')
      setPermissions(response.data);
    } catch (error) {
      console.error('Failed to fetch permissions:', error);
    }
  };

  const handleAddRole = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setRoleName('');
    setSelectedPermissions([]);
  };

  const handleSubmit = async () => {
    try {
      await api.post('/api/roles', {
        name: roleName,
        permissions: selectedPermissions,
      });
      handleModalClose();
      fetchRoles();
    } catch (error) {
      console.error('Failed to add role:', error);
    }
  };

  const handleBack = () => {
    router.push('/admin/manage-account');
  };

  const handleViewPermissions = (role: Role) => {
    console.log('Selected Role:', role);
    console.log('Role Permissions:', role.permissions);
    setSelectedRole(role);
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedRole(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={handleBack}
            >
              Back
            </Button>
            <Typography variant="h5" component="h2">
              Role Management
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddRole}
          >
            Add New Role
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Role Name</TableCell>
                <TableCell>Permissions</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell>{role.name}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography>
                        {role.permissions.length} permissions
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => handleViewPermissions(role)}
                        color="primary"
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    {/* Other actions if needed */}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog 
          open={isModalOpen} 
          onClose={handleModalClose}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Add New Role</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Role Name"
              fullWidth
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
            />
            <Box sx={{ mt: 2, maxHeight: 300, overflow: 'auto' }}>
              {permissions.map((permission) => (
                <FormControlLabel
                  key={permission.id}
                  control={
                    <Checkbox
                      checked={selectedPermissions.includes(permission.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedPermissions([...selectedPermissions, permission.id]);
                        } else {
                          setSelectedPermissions(
                            selectedPermissions.filter((id) => id !== permission.id)
                          );
                        }
                      }}
                    />
                  }
                  label={`${permission.name} - ${permission.description}`}
                />
              ))}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleModalClose}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained">
              Add Role
            </Button>
          </DialogActions>
        </Dialog>

        <Modal
          open={isViewModalOpen}
          onClose={handleCloseViewModal}
          aria-labelledby="view-permissions-modal"
        >
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 1,
            color: 'black'
          }}>
            <Typography variant="h6" component="h2" gutterBottom color="black">
              {selectedRole?.name} Permissions
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Path</TableCell>
                    <TableCell>Method</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedRole?.permissions?.map((permission) => (
                    <TableRow key={permission.id}>
                      <TableCell>{permission.name}</TableCell>
                      <TableCell>{permission.path}</TableCell>
                      <TableCell>{permission.method}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={handleCloseViewModal}>Close</Button>
            </Box>
          </Box>
        </Modal>
      </Paper>
    </Box>
  );
};

export default ManageAccountPage;
