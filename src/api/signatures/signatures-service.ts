import { apiClient } from '@/api/client.ts';
import type { IPaginationResult } from '@/api/shared/types/paginated-result-dto.ts';
import type { ISignatureDto } from '@/api/signatures/types/signature-dto.ts';
import type { IPaginatedRequestDto } from '@/api/shared/types/paginated-request-dto.ts';
import type { ICreateSignatureRequestDto } from '@/api/signatures/types/create-signature-request-dto.ts';
import type { IGetGeneratedSignatureResultDto } from '@/api/signatures/types/get-generated-signature-result-dto.ts';


const controllerPath = 'signatures';
const baseQueryKey = ['signatures'];

export const signaturesService = {
  queryKey: () => baseQueryKey,

  list: {
    queryKey: (query?: IPaginatedRequestDto) => [...baseQueryKey, query],
    call: async (query?: IPaginatedRequestDto) => apiClient.get<IPaginationResult<ISignatureDto>>(`${controllerPath}`, {
      searchParams: { page: query?.page ?? 1, limit: query?.limit ?? 10 }
    }).json()
  },

  create: {
    queryKey: (body: ICreateSignatureRequestDto) => [...baseQueryKey, 'create'],
    call: async (body: ICreateSignatureRequestDto) => apiClient.post<ISignatureDto>(`${controllerPath}`, {
      json: body
    }).json()
  },

  getGenerated: {
    queryKey: (id: number) => [...baseQueryKey, id, 'generated'],
    call: async (id: number) => apiClient.get<IGetGeneratedSignatureResultDto>(`${controllerPath}/${id}/generated`).json()
  }
};
