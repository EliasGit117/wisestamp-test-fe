import type { SignatureTemplateId } from '@/api/signatures/types/singature-template-id-enum.ts';


export interface ISignatureDto {
  id: number;
  userId: number;
  templateId: SignatureTemplateId;
  payload: Record<string, string>;
  created: string;
  updated: string;
}