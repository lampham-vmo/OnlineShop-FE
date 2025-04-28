import { z as zod } from 'zod';

export const PaymentMethodCreateDtoValidation = zod.object({
  name: zod
    .string({ required_error: 'Name cannot be empty' })
    .trim()
    .min(1, 'Name cannot be empty')
    .max(255, 'Name cannot be longer than 255 characters'),
});

export type PaymentMethodFormData = zod.infer<
  typeof PaymentMethodCreateDtoValidation
>;

export enum EPermissionPaymentMethod {
  CREATE_PAYMENT_METHOD = 'CREATE_PAYMENT_METHOD',
  GET_ALL_PAYMENT_METHOD = 'GET_ALL_PAYMENT_METHOD',
  CHANGE_STATUS_PAYMENT_METHOD = 'CHANGE_STATUS_PAYMENT_METHOD',
}

export enum EPaymentMethodStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}
