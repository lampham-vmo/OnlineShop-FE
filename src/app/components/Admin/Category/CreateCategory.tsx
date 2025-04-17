import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  IconButton,
  Modal,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { getCategory } from '@/generated/api/endpoints/category/category';
import toast from 'react-hot-toast';
import CloseIcon from '@mui/icons-material/Close';
import {
  CategoryCreateDtoValidation,
  CategoryFormData,
} from './category.validation';
import RequiredLabel from '../../Common/RequiredLabel';

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

interface ICreateCategoryProps {
  onSuccess: () => void;
}

const CreateCategory = ({ onSuccess }: ICreateCategoryProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(CategoryCreateDtoValidation),
  });

  const handleCloseModal = () => {
    setOpen(false);
    reset();
  };

  const onSubmit = async (data: CategoryFormData) => {
    setLoading(true);
    try {
      const response = await getCategory().categoryControllerCreate(data);

      if (response.success) {
        toast.success('Create successfully!');
        handleCloseModal();
        onSuccess();
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpen(true)}
        >
          Create
        </Button>
      </Box>

      <Modal
        open={open}
        onClose={(_, reason: string) => {
          if (reason !== 'backdropClick') {
            handleCloseModal();
          }
        }}
      >
        <Box sx={style}>
          <IconButton
            onClick={handleCloseModal}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
            }}
          >
            <CloseIcon />
          </IconButton>

          <Typography variant="h6" mb={2}>
            Create Category
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              <TextField
                label={<RequiredLabel label="Name" />}
                fullWidth
                {...register('name')}
                error={!!errors.name}
                helperText={errors.name?.message}
              />

              <TextField
                label={<RequiredLabel label="Description" />}
                fullWidth
                multiline
                rows={4}
                {...register('description')}
                error={!!errors.description}
                helperText={errors.description?.message}
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                loading={loading}
              >
                Create
              </Button>
            </Stack>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default CreateCategory;
