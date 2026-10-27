import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import type { EventModel } from "@/types/event.types";
import type { Category } from "@/types/category.type";

export interface EventQueryParams {
  search?: string;
  categoryId?: number;
  location?: string;
  page: number;
  limit: number;
}

export interface PaginatedEventsResponse {
  data: EventModel[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    locations?: string[];
  };
}

// 1. Hook untuk mengambil daftar kategori (di-cache secara otomatis)
export const useCategoriesQuery = () => {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await axiosInstance.get<Category[]>("/categories");
      return res.data;
    },
    staleTime: 5 * 60 * 1000, // Cache kategori selama 5 menit
  });
};

// 2. Hook untuk mengambil daftar event dengan Backend Pagination
export const useEventsQuery = (filters: EventQueryParams) => {
  return useQuery<PaginatedEventsResponse>({
    queryKey: ["events", filters],
    queryFn: async () => {
      const params: Record<string, any> = {
        page: filters.page,
        limit: filters.limit,
      };

      if (filters.search) params.search = filters.search;
      if (filters.categoryId && filters.categoryId !== 0) {
        params.categoryId = filters.categoryId;
      }
      if (filters.location && filters.location !== "All Locations") {
        params.location = filters.location;
      }

      const res = await axiosInstance.get<PaginatedEventsResponse>("/events", {
        params,
      });
      return res.data;
    },
    // Pertahankan data halaman sebelumnya di layar saat berpindah halaman
    placeholderData: keepPreviousData,
  });
};