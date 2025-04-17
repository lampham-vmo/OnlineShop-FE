import { getCategory } from '@/generated/api/endpoints/category/category';
import { Close, Delete } from '@mui/icons-material';
import {
  Box,
  Button,
  IconButton,
  Modal,
  Stack,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface IDeleteCategoryProps {
  id: number;
  name: string;
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

const DeleteCategory = ({ id, name, onSuccess }: IDeleteCategoryProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleConfirmDelete = async () => {
    setLoading(true);
    try {
      const response = await getCategory().categoryControllerDelete(id);
      if (response.success) {
        toast.success('Category deleted successfully!');
        onSuccess();
        handleClose();
      }
    } catch (error: any) {
      toast.error(error.message || 'Delete failed!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="contained"
        color="error"
        startIcon={<Delete />}
        size="small"
        onClick={handleOpen}
      >
        Delete
      </Button>

      <Modal
        open={open}
        onClose={(_, reason) => {
          if (reason !== 'backdropClick') handleClose();
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
            <Close />
          </IconButton>

          <Typography variant="h6" mb={3}>
            Are you sure you want to delete the category "
            {<span className="text-red-light">{name}</span>}"?
          </Typography>

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button variant="outlined" onClick={handleClose}>
              Close
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleConfirmDelete}
              loading={loading}
            >
              Confirm
            </Button>
          </Stack>
        </Box>
      </Modal>
    </>
  );
};

export default DeleteCategory;
