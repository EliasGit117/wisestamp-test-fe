import type { ISignatureDto } from './signature-dto';

export interface IGetGeneratedSignatureResultDto {
  signature: ISignatureDto;
  text: string;
  html: string;
}