import { Close } from '@mui/icons-material';
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

interface IConfirmModalProps {
  onConfirm: () => Promise<void>;
  title: string;
}

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const ConfirmModalOrder = ({ onConfirm, title }: IConfirmModalProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
      toast.success('Update successful');
      handleClose();
    } catch (error: any) {
      toast.error(error?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button variant="contained" size="small" onClick={handleOpen}>
        {title}
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
            Are you sure you want to {title.toLowerCase()} this order?
          </Typography>

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button variant="outlined" onClick={handleClose}>
              Close
            </Button>
            <Button
              variant="contained"
              onClick={handleConfirm}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Confirm'}
            </Button>
          </Stack>
        </Box>
      </Modal>
    </>
  );
};

export default ConfirmModalOrder;
