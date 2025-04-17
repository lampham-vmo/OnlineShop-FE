import { z as zod } from 'zod';

export const CategoryCreateDtoValidation = zod.object({
  name: zod
    .string({ required_error: 'Name cannot be empty' })
    .min(1, 'Name cannot be empty')
    .max(255, 'Name cannot be longer than 255 characters'),

  description: zod
    .string({ required_error: 'Description cannot be empty' })
    .min(1, 'Description cannot be empty')
    .max(255, 'Description cannot be longer than 255 characters'),
});

export type CategoryFormData = zod.infer<typeof CategoryCreateDtoValidation>;
