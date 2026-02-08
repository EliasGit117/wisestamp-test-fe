import { apiClient } from '@/api/client.ts';
import type { IUserDto } from '@/api/auth/types/user-dto.ts';
import type { ISignInResultDto } from '@/api/auth/types/sign-in-result-dto.ts';
import type { ISignInRequestDto } from '@/api/auth/types/sign-in-request-dto.ts';
import type { ISignUpRequestDto } from '@/api/auth/types/sign-up-request-dto.ts';
import type { ISignUpResultDto } from '@/api/auth/types/sign-up-result-dto.ts';

const controllerPath = 'auth';
const baseQueryKey = ['auth'];

export const authService = {
  queryKey: () => baseQueryKey,

  me: {
    queryKey: () => [...baseQueryKey, 'me'],
    call: async () => apiClient.get(`${controllerPath}/me`).json<IUserDto>()
  },

  signIn: {
    queryKey: () => [...baseQueryKey, 'sign-in'],
    call: async (body: ISignInRequestDto) => apiClient
      .post(`${controllerPath}/sign-in`, { json: body }).json<ISignInResultDto>()
  },

  signUp: {
    queryKey: () => [...baseQueryKey, 'sign-up'],
    call: async (body: ISignUpRequestDto) => apiClient
      .post<ISignUpResultDto>(`${controllerPath}/sign-up'`, { json: body }).json()
  },

  signOut: {
    queryKey: () => [...baseQueryKey, 'sign-out'],
    call: async () => apiClient.post(`${controllerPath}/sign-out`)
  }
};