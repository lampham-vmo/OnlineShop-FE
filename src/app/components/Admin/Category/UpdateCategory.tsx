import { Category } from '@/generated/api/models';
import { Edit } from '@mui/icons-material';
import {
  Box,
  Button,
  IconButton,
  Modal,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {
  CategoryCreateDtoValidation,
  CategoryFormData,
} from './category.validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { getCategory } from '@/generated/api/endpoints/category/category';
import CloseIcon from '@mui/icons-material/Close';
import toast from 'react-hot-toast';
import RequiredLabel from '../../Common/RequiredLabel';

interface IUpdateCategoryProps {
  category: Category;
  onSuccess: () => void;
}

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

const UpdateCategory = ({ category, onSuccess }: IUpdateCategoryProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(CategoryCreateDtoValidation),
    defaultValues: {
      name: category.name,
      description: category.description,
    },
  });

  const handleOpen = () => {
    reset({
      name: category.name,
      description: category.description,
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const onSubmit = async (data: CategoryFormData) => {
    setLoading(true);
    try {
      const response = await getCategory().categoryControllerUpdate(
        category.id,
        data,
      );
      if (response.success) {
        toast.success('Update successfully!');
        handleClose();
        onSuccess();
      }
    } catch (error: any) {
      toast.error(error.message[0] || 'Update failed!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        startIcon={<Edit />}
        size="small"
        onClick={handleOpen}
      >
        Edit
      </Button>
      <Modal
        open={open}
        onClose={(_, reason: string) => {
          if (reason !== 'backdropClick') {
            handleClose();
          }
        }}
      >
        <Box sx={style}>
          <IconButton
            onClick={handleClose}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
            }}
          >
            <CloseIcon />
          </IconButton>

          <Typography variant="h6" mb={2}>
            Update Category
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
                Update
              </Button>
            </Stack>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default UpdateCategory;
