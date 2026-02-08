import * as z from 'zod';
import { ZodType } from 'zod';

export interface ISignInRequestDto {
  email: string;
  password: string;
}

export const signInRequestSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),

}) satisfies ZodType<ISignInRequestDto>;

