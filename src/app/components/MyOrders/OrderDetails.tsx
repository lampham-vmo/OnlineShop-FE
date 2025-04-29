'use client';

import {
  Box,
  IconButton,
  Modal,
  Stack,
  Typography,
  Divider,
  Chip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import { OrderResponseDTO } from '@/generated/api/models';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { getStatusColor } from '.';

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  maxHeight: '90vh',
  overflowY: 'auto',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

interface OrderDetailsProps {
  order: OrderResponseDTO;
}

const OrderDetails = ({ order }: OrderDetailsProps) => {
  const [open, setOpen] = useState(false);

  const handleCloseModal = () => {
    setOpen(false);
  };

  return (
    <>
      <IconButton color="primary" onClick={() => setOpen(true)}>
        <VisibilityIcon />
      </IconButton>

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

          <Typography className="text-dark" variant="h6" mb={2}>
            Order Details - #{order.id}
          </Typography>

          <Stack spacing={2}>
            <Typography>
              <strong className="text-blue">Receiver:</strong> {order.receiver}
            </Typography>
            <Typography>
              <strong className="text-blue">Phone:</strong>{' '}
              {order.receiver_phone}
            </Typography>
            <Typography>
              <strong className="text-blue">Address:</strong>{' '}
              {order.delivery_address}
            </Typography>
            <Typography component="div">
              <strong className="text-blue">Status:</strong>
              <Chip
                label={order.status}
                color={getStatusColor(order.status)}
                size="small"
                className="ml-2"
              />
            </Typography>
            <Typography>
              <strong className="text-blue">SubTotal:</strong> $
              {order.subTotal.toLocaleString()}
            </Typography>
            <Typography>
              <strong className="text-blue">Total:</strong> $
              {order.total.toLocaleString()}
            </Typography>
            <Typography>
              <strong className="text-blue">Payment Method:</strong>{' '}
              {order.payment?.name}
            </Typography>
            <Typography>
              <strong className="text-blue">Created At:</strong>{' '}
              {new Date(order.createdAt).toLocaleString()}
            </Typography>

            <Divider />

            <Typography className="text-dark" variant="h6" mt={2}>
              Order Items
            </Typography>
            {order.order_details.map((item, idx) => (
              <Box
                key={idx}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                borderBottom="1px solid #eee"
                py={1}
              >
                <Box>
                  <Typography>
                    <strong>Name:</strong> {item.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Price: $
                    {(item.price * (1 - item.discount / 100)).toLocaleString()}{' '}
                    - Quantity: {item.quantity}
                  </Typography>
                </Box>
                <Box
                  component="img"
                  src={JSON.parse(item.image)[0]}
                  alt={item.name}
                  width={80}
                  height={80}
                  sx={{ objectFit: 'cover', borderRadius: 1 }}
                />
              </Box>
            ))}
          </Stack>
        </Box>
      </Modal>
    </>
  );
};

export default OrderDetails;
