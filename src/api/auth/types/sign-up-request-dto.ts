import * as z from 'zod';
import type { ZodType } from 'zod';

export interface ISignUpRequestDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export const signUpRequestSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters')

}) satisfies ZodType<ISignUpRequestDto>;

