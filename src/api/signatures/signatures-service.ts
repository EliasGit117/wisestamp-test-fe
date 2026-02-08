import { apiClient } from '@/api/client.ts';
import type { IPaginationResult } from '@/api/shared/types/paginated-result-dto.ts';
import type { ISignatureDto } from '@/api/signatures/types/signature-dto.ts';
import type { IPaginatedRequestDto } from '@/api/shared/types/paginated-request-dto.ts';
import type { ICreateSignatureRequestDto } from '@/api/signatures/types/create-signature-request-dto.ts';


const controllerPath = 'signatures';
const baseQueryKey = ['signatures'];

export const signaturesService = {
  queryKey: () => baseQueryKey,

  list: {
    queryKey: (query?: IPaginatedRequestDto) => [...baseQueryKey, query],
    call: async (query?: IPaginatedRequestDto) => apiClient.get(`${controllerPath}`, {
      searchParams: { page: query?.page ?? 1, limit: query?.limit ?? 10 }
    }).json<IPaginationResult<ISignatureDto>>()
  },

  create: {
    queryKey: (body: ICreateSignatureRequestDto) => [...baseQueryKey, 'create'],
    call: async (body: ICreateSignatureRequestDto) => apiClient.post(`${controllerPath}`, {
      json: body
    }).json<ISignatureDto>()
  }
};
