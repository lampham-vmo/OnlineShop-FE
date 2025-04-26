import React, { useEffect, useState } from 'react';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TextField, Button } from '@mui/material';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import RequiredLabel from '../Common/RequiredLabel';
import { OnApproveActions } from '@paypal/paypal-js';
import { getOrders } from '@/generated/api/endpoints/orders/orders';
import { useRouter } from 'next/navigation';

const orderSchema = z.object({
  fullName: z.string().min(1, 'Recipient name is required'),
  address: z.string().min(1, 'Shipping address is required'),
  phoneNumber: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .regex(/^[0-9]+$/, 'Phone number must contain only numbers'),
});

type OrderFormData = z.infer<typeof orderSchema>;

const OrderFormFields = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<OrderFormData>();

  return (
    <>
      <TextField
        // label="Recipient Name"
        label={<RequiredLabel label="Recipient Name" />}
        variant="outlined"
        fullWidth
        {...register('fullName')}
        error={!!errors.fullName}
        helperText={errors.fullName?.message}
      />

      <TextField
        label={<RequiredLabel label="Shipping Address" />}
        variant="outlined"
        fullWidth
        {...register('address')}
        error={!!errors.address}
        helperText={errors.address?.message}
      />

      <TextField
        label={<RequiredLabel label="Phone Number" />}
        variant="outlined"
        fullWidth
        {...register('phoneNumber')}
        error={!!errors.phoneNumber}
        helperText={errors.phoneNumber?.message}
      />
    </>
  );
};

type EnvPaypalOptions = 'production' | 'sandbox';

const ButtonCheckout = () => {
  const router = useRouter();

  const {
    handleSubmit,
    trigger,
    formState: { isValid },
    getValues,
  } = useFormContext<OrderFormData>();
  const [paypalEnabled, setPaypalEnabled] = useState(false);

  const initialOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '',
    enableFunding: '',
    disableFunding: ['paylater', 'card'],
    buyerCountry: 'US',
    currency: 'USD',
    components: 'buttons',
    environment: 'sandbox' as EnvPaypalOptions,
    locale: 'en_GB',
  };

  const { ordersControllerCreate, ordersControllerCaptureOrder } = getOrders();

  const onSubmit = async (data: OrderFormData) => {
    try {
      const response = await ordersControllerCreate({
        cartId: 1,
        paymentId: 1,
        receiver: data.fullName,
        receiver_phone: data.phoneNumber,
        delivery_address: data.address,
      });
      if (response.success) {
        router.push('/success');
      }
    } catch (error) {
      router.push('/failed');
    }
  };

  const handlePaypalClick = async (): Promise<void> => {
    const isValid = await trigger();
    setPaypalEnabled(isValid);
  };

  const listMethod = [
    { id: 1, name: 'Cash on delivery', status: 'active' },
    { id: 2, name: 'Paypal', status: 'active' },
  ];

  const paypalAvailable = listMethod.some(
    (method) => method.id === 2 && method.status === 'active',
  );
  let myOrderId = '';

  const handleCrearePaypalOrder = async () => {
    try {
      const formData = getValues();

      const response = await ordersControllerCreate({
        cartId: 1,
        paymentId: 2,
        receiver: formData.fullName,
        receiver_phone: formData.phoneNumber,
        delivery_address: formData.address,
      });
      const [orderPaypalId, orderId] = response.data.id.split('-');
      myOrderId = orderId;
      return orderPaypalId;
    } catch (error: any) {
      router.push('/failed');
      return '';
    }
  };

  const handleCapturePaypalOrder = async (
    orderPaypalId: string,
    actions: OnApproveActions,
  ) => {
    try {
      const response = await ordersControllerCaptureOrder(
        orderPaypalId,
        myOrderId,
      );

      if (response.success) {
        router.push('/success');
      }
    } catch (error: any) {
      router.push('/failed');
    }
  };

  useEffect(() => {
    setPaypalEnabled(isValid);
  }, [isValid]);

  return (
    <div className="border-gray-3 mt-6 py-5 px-4 sm:px-8.5 bg-white shadow-1 rounded-[10px]">
      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit(onSubmit)}
        >
          Place Order
        </Button>

        {paypalAvailable && (
          <div className="w-full sm:w-auto">
            <PayPalScriptProvider options={initialOptions}>
              <PayPalButtons
                style={{
                  shape: 'rect',
                  layout: 'vertical',
                  color: 'blue',
                  label: 'checkout',
                }}
                forceReRender={[paypalEnabled]}
                disabled={!paypalEnabled}
                onClick={handlePaypalClick}
                createOrder={handleCrearePaypalOrder}
                onApprove={({ orderID }, actions) =>
                  handleCapturePaypalOrder(orderID, actions)
                }
              />
            </PayPalScriptProvider>
          </div>
        )}
      </div>
    </div>
  );
};

const OrderForm = () => {
  const methods = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    mode: 'onChange',
  });

  return (
    <FormProvider {...methods}>
      <div className="bg-white shadow-1 mt-10 rounded-[10px]">
        <div className="py-5 px-4 sm:px-8.5">
          <h3 className="font-medium text-xl text-dark mb-4">
            Shipping Information
          </h3>
          <form className="flex flex-col gap-4" noValidate autoComplete="off">
            <OrderFormFields />
          </form>
        </div>
      </div>
      <ButtonCheckout />
    </FormProvider>
  );
};

export default OrderForm;
