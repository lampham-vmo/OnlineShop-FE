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
  Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import { useRouter } from 'next/navigation';
import { Description } from '@mui/icons-material';

import { PermissionDTO } from '@/generated/api/models';
import { Permission } from '@/generated/api/models';
import {Role} from '@/generated/api/models/role';

import { getRole } from '@/generated/api/endpoints/role/role';
import { useAuthStore } from '@/stores/authStore';
import { getPermission } from '@/generated/api/endpoints/permission/permission';
const MethodChip = ({ method }: { method: string }) => {
  const getMethodColor = (method: string) => {
    switch (method.toLowerCase()) {
      case 'get':
        return { bg: '#4CAF50', color: '#fff' }; // Green
      case 'post':
        return { bg: '#FFC107', color: '#000' }; // Yellow
      case 'put':
        return { bg: '#2196F3', color: '#fff' }; // Blue
      case 'delete':
        return { bg: '#f44336', color: '#fff' }; // Red
      case 'patch':
        return { bg: '#9C27B0', color: '#fff' }; // Purple
      default:
        return { bg: '#999', color: '#fff' };
    }
  };

  const colors = getMethodColor(method);

  return (
    <Chip
      label={method.toUpperCase()}
      size="small"
      sx={{
        backgroundColor: colors.bg,
        color: colors.color,
        fontWeight: 'bold',
        minWidth: '80px',
        borderRadius: '4px',
        '& .MuiChip-label': {
          px: 1,
        },
      }}
    />
  );
};

export const ManageRole = () => {
  const router = useRouter();
  const [roles, setRoles] = useState<Role[]>();
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const [roleName, setRoleName] = useState('');
  const [roleDescription, setRoleDescription] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { roleControllerFindAll, roleControllerAddRole, roleControllerUpdateRole } = getRole();
  const {permissionControllerFindAll} = getPermission();
  
  useEffect(() => {
  
    fetchRoles();
    fetchPermissions();
    
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await roleControllerFindAll()
      setRoles(response.data);
    } catch (error) {
      console.error('Failed to fetch roles:', error);
    }
  };

  const fetchPermissions = async () => {
    try {
      const response = await permissionControllerFindAll()
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
    setRoleDescription('');
    setSelectedPermissions([]);
  };

  const handleSubmit = async () => {
    if (!roleName.trim()) {
      return;
    }
    console.log(roleName, roleDescription, selectedPermissions);
    try {
        await roleControllerAddRole({
            name: roleName,
            description: roleDescription,
            permissionIds: selectedPermissions,
        })

    //   await api.post('/role', {
    //     name: roleName,
    //     description: roleDescription,
    //     permissionIds: selectedPermissions,
    //   });
      handleModalClose();
      fetchRoles();
    } catch (error) {
    window.alert(error.response.data.error.message)
    
    // setError(error.response.data.error.message)
    //   console.error('Failed to add role:', error.response.data.error.message);
    }
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

  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
    setRoleName(role.name);
    setRoleDescription(role.description || '');
    setSelectedPermissions(role.permissions.map(p => p.id));
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setSelectedRole(null);
    setRoleName('');
    setRoleDescription('');
    setSelectedPermissions([]);
  };

  const handleEditSubmit = async () => {
    if (!roleName.trim() || !selectedRole) {
      return;
    }
    try {
        await roleControllerUpdateRole({
            id: selectedRole.id,
            name: roleName,
            description: roleDescription,
            permissionIds: selectedPermissions,
        })
      handleEditModalClose();
      fetchRoles();
    } catch (error) {
      console.error('Failed to update role:', error);
    }
  };

  return (
    <Box sx={{ p: 1 }}>
      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
           
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
              { roles && roles.map((role) => (
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
                    <IconButton
                      size="small"
                      onClick={() => handleEditRole(role)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
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
              required
              fullWidth
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              error={!roleName}
              helperText={!roleName ? "Role name is required" : ""}
            />
            <TextField
              margin="dense"
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={roleDescription}
              onChange={(e) => setRoleDescription(e.target.value)}
              sx={{ mt: 2 }}
            />
            <Box sx={{ mt: 2, maxHeight: 300, overflow: 'auto' }}>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox"></TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Path</TableCell>
                      <TableCell>Method</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {permissions.map((permission) => (
                      <TableRow key={permission.id}>
                        <TableCell padding="checkbox">
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
                        </TableCell>
                        <TableCell>{permission.name}</TableCell>
                        <TableCell>{permission.path}</TableCell>
                        <TableCell>
                          <MethodChip method={permission.method} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleModalClose}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained">
              Add Role
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog 
          open={isEditModalOpen} 
          onClose={handleEditModalClose}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Edit Role</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Role Name"
              required
              fullWidth
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              error={!roleName}
              helperText={!roleName ? "Role name is required" : ""}
            />
          
             
            
            <TextField
              margin="dense"
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={roleDescription}
              onChange={(e) => setRoleDescription(e.target.value)}
              sx={{ mt: 2 }}
            />
            <Box sx={{ mt: 2, maxHeight: 300, overflow: 'auto' }}>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox"></TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Path</TableCell>
                      <TableCell>Method</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {permissions.map((permission) => (
                      <TableRow key={permission.id}>
                        <TableCell padding="checkbox">
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
                        </TableCell>
                        <TableCell>{permission.name}</TableCell>
                        <TableCell>{permission.path}</TableCell>
                        <TableCell>
                          <MethodChip method={permission.method} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditModalClose}>Cancel</Button>
            <Button onClick={handleEditSubmit} variant="contained">
              Update Role
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
            width: '80%',
            maxWidth: 'md',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 1,
            color: 'black',
            maxHeight: '90vh',
            overflow: 'auto'
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
                      <TableCell>
                        <MethodChip method={permission.method} />
                      </TableCell>
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

