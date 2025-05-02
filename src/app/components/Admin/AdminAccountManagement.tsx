'use client';

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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TablePagination,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect, useState } from 'react';
import { getUsers } from '@/generated/api/endpoints/users/users';
import {
  GetUserAccountDTO,
  Role,
} from '@/generated/api/models';
import { getRole } from '@/generated/api/endpoints/role/role';

const {
  userControllerFindAll,
  userControllerDelete,
  userControllerUpdateUserRole,
} = getUsers();

const { roleControllerFindAll } = getRole();

export default function AccountPage() {
  const [accounts, setAccounts] = useState<GetUserAccountDTO[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(
    null,
  );
  const [editAccountId, setEditAccountId] = useState<number | null>(null);
  const [selectedRoleId, setSelectedRoleId] = useState<number>(1);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await userControllerFindAll();
        setAccounts(res.data.accounts);
        const res1 = await roleControllerFindAll();
        setRoles(res1.data);
      } catch (err) {
        console.error('Failed to fetch accounts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  const handleConfirmDelete = (id: number) => {
    setSelectedAccountId(id);
    setOpenDialog(true);
  };

  const handleDelete = async () => {
    if (!selectedAccountId) return;
    try {
      await userControllerDelete(String(selectedAccountId));
      setAccounts((prev) => prev.filter((a) => a.id !== selectedAccountId));
    } catch (err) {
      console.error('Failed to delete account:', err);
    } finally {
      setOpenDialog(false);
      setSelectedAccountId(null);
    }
  };

  const handleRoleUpdate = async () => {
    if (!editAccountId) return;
    try {
      await userControllerUpdateUserRole(String(editAccountId), {
        role_id: selectedRoleId,
      });
      const res = await userControllerFindAll();
      setAccounts(res.data.accounts);
    } catch (err) {
      console.error('Failed to update role', err);
    } finally {
      setEditDialogOpen(false);
      setEditAccountId(null);
    }
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
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
              accounts
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((account) => (
                  <TableRow key={account.id}>
                    <TableCell>{account.fullname}</TableCell>
                    <TableCell>{account.email}</TableCell>
                    <TableCell>{account.roleName}</TableCell>
                    <TableCell>
                      {account.status ? 'Active' : 'Inactive'}
                    </TableCell>
                    <TableCell>
                      {new Date(account.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Edit Role">
                        <IconButton
                          onClick={() => {
                            setEditAccountId(account.id);
                            setSelectedRoleId(
                              roles.find(
                                (role) => role.name === account.roleName,
                              )!.id,
                            );
                            setEditDialogOpen(true);
                          }}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          onClick={() => handleConfirmDelete(account.id)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={accounts.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Delete Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this account? This action cannot be
            undone.
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

      {/* Edit Role Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit User Role</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Select a new role for this user.
          </DialogContentText>
          <Box mt={2}>
            <FormControl fullWidth>
              <InputLabel id="role-select-label">Role</InputLabel>
              <Select
                labelId="role-select-label"
                value={selectedRoleId}
                onChange={(e) => setSelectedRoleId(Number(e.target.value))}
                label="Role"
              >
                {roles.map((role) => (
                  <MenuItem key={role.id} value={role.id}>
                    {role.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleRoleUpdate} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
