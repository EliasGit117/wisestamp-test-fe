import type { IUserDto } from '@/api/auth/types/user-dto.ts';

export interface ISignInResultDto {
  user: IUserDto;
}