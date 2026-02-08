import { SignatureTemplateId } from '@/api/signatures/types/singature-template-id-enum.ts';
import * as z from 'zod';


export interface ICreateSignatureRequestDto {
  templateId: SignatureTemplateId;
  payload: Record<string, string>;
}


export const createSignatureSchema = z.object({
  templateId: z.enum(SignatureTemplateId),
  email: z.email('Invalid email'),
  fullName: z.string().min(1, 'Full name is required'),
  phone: z.string().min(1, 'Phone is required'),
});