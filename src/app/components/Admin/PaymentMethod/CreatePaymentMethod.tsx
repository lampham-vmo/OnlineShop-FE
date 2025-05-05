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
import toast from 'react-hot-toast';
import CloseIcon from '@mui/icons-material/Close';
import RequiredLabel from '../../Common/RequiredLabel';
import {
  PaymentMethodFormData,
  PaymentMethodCreateDtoValidation,
} from './payment-method.validation';
import { getPaymentMethod } from '@/generated/api/endpoints/payment-method/payment-method';

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

interface ICreatePaymentMethodProps {
  onSuccess: () => void;
}

const CreatePaymentMethod = ({ onSuccess }: ICreatePaymentMethodProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { paymentMethodControllerCreate } = getPaymentMethod();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PaymentMethodFormData>({
    resolver: zodResolver(PaymentMethodCreateDtoValidation),
  });

  const handleCloseModal = () => {
    setOpen(false);
    reset();
  };

  const onSubmit = async (data: PaymentMethodFormData) => {
    setLoading(true);
    try {
      const response = await paymentMethodControllerCreate(data);
      if (response.success) {
        toast.success('Create payment method uccessfully!');
        handleCloseModal();
        onSuccess();
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(
        Array.isArray(error.message) ? error.message[0] : error.message,
      );
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
            Create Payment Method
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

export default CreatePaymentMethod;
