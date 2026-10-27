export interface PaginationMeta {
  page: number;
  take: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginationResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface PaginationQueryParams {
  page?: number;
  take?: number;
  sortOrder?: "asc" | "desc";
  sortBy?: string;
  search?: string;
}
