'use client';
import { getUsers } from '@/generated/api/endpoints/users/users';
import { Profile, UpdatePasswordDTO } from '@/generated/api/models';
import {
  userControllerUpdateProfileBody,
  userControllerUpdatePasswordBody,
} from '@/generated/api/schemas/users/users.zod';
import { useAuthStore } from '@/stores/authStore';
import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
  IconButton,
  Modal,
  TextField,
  Button,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export default function ProfileComponent() {
  const [profile, setProfile] = useState<Profile | undefined>(undefined);
  const {
    userControllerGetProfileById,
    userControllerUpdateProfile,
    userControllerUpdatePassword,
  } = getUsers();
  const user = useAuthStore((state) => state.user);

  const [openModal, setOpenModal] = useState(false);
  const [fieldToEdit, setFieldToEdit] = useState<
    'email' | 'phone' | 'fullname' | 'address'
  >('email');

  const { control, handleSubmit, setValue, reset } = useForm({
    resolver: zodResolver(userControllerUpdateProfileBody),
    defaultValues: {
      email: '',
      phone: '',
      fullname: '',
      address: '',
    },
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleOpenModal = (field: any) => {
    if (profile) {
      setFieldToEdit(field);
      setValue('email', profile.email || '');
      setValue('phone', profile.phone || '');
      setValue('fullname', profile.fullname || '');
      setValue('address', profile.address || '');
      setOpenModal(true);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setErrorMessage('');
    reset();
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: any) => {
    console.log('hello');
    console.log(profile, user);
    if (!profile || !user) return;

    try {
      const updatedProfile = { ...profile, ...data };
      const response = await userControllerUpdateProfile(user.id, data);
      console.log(response);
      if (response.success) {
        setProfile(updatedProfile);
        window.alert('Profile updated successfully!');
        setErrorMessage('');
        console.log('Updated Profile:', updatedProfile);
        setOpenModal(false);
      } else {
        console.error('Failed to update profile:', response);
        setErrorMessage('Failed to update profile.');
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        window.location.href = '/signin';
        return;
      }
      const response = await userControllerGetProfileById(user.id);
      setProfile(response.data);
    };
    fetchProfile();
  }, [user, userControllerGetProfileById]);

  const [openPasswordModal, setOpenPasswordModal] = useState(false);

  const {
    control: passwordControl,
    handleSubmit: handlePasswordSubmit,
    reset: resetPasswordForm,
    formState: { errors: passwordErrors },
  } = useForm({
    resolver: zodResolver(userControllerUpdatePasswordBody),
    defaultValues: {
      oldPassword: '',
      password: '',
      confirmPassword: '',
    },
  });

  const handleOpenPasswordModal = () => {
    setOpenPasswordModal(true);
  };

  const handleClosePasswordModal = () => {
    setOpenPasswordModal(false);
    resetPasswordForm();
  };

  const onChangePassword = async (data: UpdatePasswordDTO) => {
    if (!user) return;

    try {
      const response = await userControllerUpdatePassword(user.id, {
        oldPassword: data.oldPassword,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });
      if (response.success) {
        window.alert('Password updated successfully!');
        handleClosePasswordModal();
      } else {
        console.error('Failed to update password:', response);
        window.alert('Failed to update password.');
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      window.alert(error.message || 'An error occurred.');
    }
  };

  return (
    <Box sx={{ padding: 4, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: 'bold', textAlign: 'center' }}
      >
        Profile
      </Typography>
      {profile ? (
        <Paper
          elevation={3}
          sx={{
            padding: 3,
            maxWidth: 600,
            margin: '0 auto',
            backgroundColor: '#ffffff',
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" sx={{ marginBottom: 2, fontWeight: 'bold' }}>
            Personal Information
          </Typography>
          <Divider sx={{ marginBottom: 2 }} />
          {[
            {
              label: 'Full Name',
              value: profile.fullname,
              field: 'fullname' as const,
            },
            { label: 'Email', value: profile.email, field: 'email' as const },
            { label: 'Phone', value: profile.phone, field: 'phone' as const },
            {
              label: 'Address',
              value: profile.address,
              field: 'address' as const,
            },
            { label: 'Role', value: profile.role?.name || '', field: 'role' },
          ].map((item) => (
            <Box
              key={item.field}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 1,
              }}
            >
              <Typography variant="body1">
                <strong>{item.label}:</strong> {item.value}
              </Typography>
              {(item.field !== 'role' && item.field !== 'email') && (
                <IconButton
                  size="small"
                  onClick={() => handleOpenModal(item.field)}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
          ))}
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenPasswordModal}
            sx={{ mt: 2 }}
          >
            Change Password
          </Button>
        </Paper>
      ) : (
        <Typography sx={{ textAlign: 'center', marginTop: 4 }}>
          Loading profile...
        </Typography>
      )}

      <Modal open={openPasswordModal} onClose={handleClosePasswordModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            Change Password
          </Typography>
          <form onSubmit={handlePasswordSubmit(onChangePassword)}>
            <Controller
              name="oldPassword"
              control={passwordControl}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Old Password"
                  type="password"
                  error={!!passwordErrors.oldPassword}
                  helperText={passwordErrors.oldPassword?.message}
                  sx={{ marginBottom: 2 }}
                />
              )}
            />
            <Controller
              name="password"
              control={passwordControl}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="New Password"
                  type="password"
                  error={!!passwordErrors.password}
                  helperText={passwordErrors.password?.message}
                  sx={{ marginBottom: 2 }}
                />
              )}
            />
            <Controller
              name="confirmPassword"
              control={passwordControl}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Confirm Password"
                  type="password"
                  error={!!passwordErrors.confirmPassword}
                  helperText={passwordErrors.confirmPassword?.message}
                  sx={{ marginBottom: 2 }}
                />
              )}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Button variant="outlined" onClick={handleClosePasswordModal}>
                Cancel
              </Button>
              <Button variant="contained" type="submit">
                Save
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            Edit {fieldToEdit}
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name={fieldToEdit}
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="New Value"
                  error={!!fieldState.error || !!errorMessage}
                  helperText={fieldState.error?.message || errorMessage}
                  sx={{ marginBottom: 2 }}
                />
              )}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Button variant="outlined" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button variant="contained" type="submit">
                Save
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </Box>
  );
}
