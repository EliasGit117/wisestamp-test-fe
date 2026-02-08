import type { SortDirection } from './sort-direction-enum';

export interface IPaginatedRequestDto {
  page?: number;
  limit?: number;
  dir?: SortDirection;
}