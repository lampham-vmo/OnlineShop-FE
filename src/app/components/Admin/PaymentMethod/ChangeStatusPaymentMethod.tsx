import { PaymentMethodResponseDto } from '@/generated/api/models';
import { EPaymentMethodStatus } from './payment-method.validation';
import { Switch } from '@mui/material';
import { useState } from 'react';
import { getPaymentMethod } from '@/generated/api/endpoints/payment-method/payment-method';
import toast from 'react-hot-toast';

interface IChangeStatusProps {
  paymentMethod: PaymentMethodResponseDto;
  onSuccess: () => void;
}

const ChangeStatusPaymentMethod = ({
  paymentMethod,
  onSuccess,
}: IChangeStatusProps) => {
  const [loading, setLoading] = useState(false);

  const { paymentMethodControllerChangeStatus } = getPaymentMethod();

  const handleChange = async () => {
    const newStatus =
      paymentMethod.status === EPaymentMethodStatus.ACTIVE
        ? EPaymentMethodStatus.INACTIVE
        : EPaymentMethodStatus.ACTIVE;

    try {
      setLoading(true);
      const response = await paymentMethodControllerChangeStatus(
        `${paymentMethod.id}`,
        newStatus,
      );
      if (response.success) {
        toast.success('Update status successfully!');
        onSuccess();
      }
    } catch (error) {
      toast.error('Update status failed!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Switch
      checked={paymentMethod.status === EPaymentMethodStatus.ACTIVE}
      onChange={handleChange}
      disabled={loading}
      color="primary"
    />
  );
};

export default ChangeStatusPaymentMethod;
