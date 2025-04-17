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
  Typography,
  Box,
  IconButton,
  Modal,
  Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Permission } from '@/generated/api/models';
import { Role } from '@/generated/api/models/role';
import { getRole } from '@/generated/api/endpoints/role/role';
import { useAuthStore } from '@/stores/authStore';
import { getPermission } from '@/generated/api/endpoints/permission/permission';
import { roleControllerUpdateRoleBody, roleControllerAddRoleBody } from '@/generated/api/schemas/role/role.zod';

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
  const { isAcceptPermission } = useAuthStore.getState();
  const {
    roleControllerFindAll,
    roleControllerAddRole,
    roleControllerUpdateRole,
  } = getRole();
  const { permissionControllerFindAll } = getPermission();

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await roleControllerFindAll();
      setRoles(response.data);
    } catch (error) {
      console.error('Failed to fetch roles:', error);
    }
  };

  const fetchPermissions = async () => {
    try {
      const response = await permissionControllerFindAll();
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

  const handleViewPermissions = (role: Role) => {
    setSelectedRole(role);
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedRole(null);
  };

  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setSelectedRole(null);
  };

  const AddRoleForm = () => {
    const {
      control,
      handleSubmit,
      reset,
      formState: { errors },
    } = useForm({
      resolver: zodResolver(
        roleControllerAddRoleBody.refine(
          (data) => data.permissionIds.length > 0,
          { message: 'At least one permission must be selected', path: ['permissionIds'] }
        )
      ),
      defaultValues: {
        name: '',
        description: '',
        permissionIds: [],
      },
    });

    const onSubmit = async (data: any) => {
      try {
        await roleControllerAddRole(data);
        handleModalClose();
        fetchRoles();
      } catch (error) {
        console.error('Failed to add role:', error);
      }
    };

    return (
      <Dialog open={isModalOpen} onClose={handleModalClose} maxWidth="md" fullWidth>
        <DialogTitle>Add New Role</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  autoFocus
                  margin="dense"
                  label="Role Name"
                  required
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  margin="dense"
                  label="Description"
                  fullWidth
                  multiline
                  rows={3}
                  sx={{ mt: 2 }}
                />
              )}
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
                          <Controller
                            name="permissionIds"
                            control={control}
                            render={({ field }) => (
                              <Checkbox
                                checked={field.value.includes(permission.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    field.onChange([...field.value, permission.id]);
                                  } else {
                                    field.onChange(field.value.filter((id) => id !== permission.id));
                                  }
                                }}
                              />
                            )}
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
            {errors.permissionIds && (
                <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                  {errors.permissionIds.message}
                </Typography>
              )}
            <DialogActions>
              <Button onClick={handleModalClose}>Cancel</Button>
              <Button type="submit" variant="contained">
                Add Role
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    );
  };

  const EditRoleForm = () => {
    const {
      control,
      handleSubmit,
      reset,
      formState: { errors },
    } = useForm({
      resolver: zodResolver(
        roleControllerUpdateRoleBody.refine(
          (data) => data.permissionIds.length > 0,
          { message: 'At least one permission must be selected', path: ['permissionIds'] }
        )
      ),
      defaultValues: {
        id: selectedRole?.id || 0,
        name: selectedRole?.name || '',
        description: selectedRole?.description || '',
        permissionIds: selectedRole?.permissions.map((p) => p.id) || [],
      },
    });

    useEffect(() => {
      if (selectedRole) {
        reset({
          id: selectedRole.id,
          name: selectedRole.name,
          description: selectedRole.description || '',
          permissionIds: selectedRole.permissions.map((p) => p.id),
        });
      }
    }, [selectedRole, reset]);

    const onSubmit = async (data: any) => {
      try {
        await roleControllerUpdateRole(data);
        handleEditModalClose();
        fetchRoles();
      } catch (error) {
        console.error('Failed to update role:', error);
      }
    };

    return (
      <Dialog open={isEditModalOpen} onClose={handleEditModalClose} maxWidth="md" fullWidth>
        <DialogTitle>Edit Role</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  autoFocus
                  margin="dense"
                  label="Role Name"
                  required
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  margin="dense"
                  label="Description"
                  fullWidth
                  multiline
                  rows={3}
                  sx={{ mt: 2 }}
                />
              )}
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
                          <Controller
                            name="permissionIds"
                            control={control}
                            render={({ field }) => (
                              <Checkbox
                                checked={field.value.includes(permission.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    field.onChange([...field.value, permission.id]);
                                  } else {
                                    field.onChange(field.value.filter((id) => id !== permission.id));
                                  }
                                }}
                              />
                            )}
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
            {errors.permissionIds && (
                <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                  {errors.permissionIds.message}
                </Typography>
              )}
            <DialogActions>
              <Button onClick={handleEditModalClose}>Cancel</Button>
              <Button type="submit" variant="contained">
                Update Role
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <Box sx={{ p: 1 }}>
      <Paper sx={{ p: 2 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h5" component="h2">
              Role Management
            </Typography>
          </Box>
          {isAcceptPermission(['add new role']) && (
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddRole}>
              Add New Role
            </Button>
          )}
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
              {roles &&
                roles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell>{role.name}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography>{role.permissions.length} permissions</Typography>
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

        <AddRoleForm />

        <EditRoleForm />

        <Modal open={isViewModalOpen} onClose={handleCloseViewModal} aria-labelledby="view-permissions-modal">
          <Box
            sx={{
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
              overflow: 'auto',
            }}
          >
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
