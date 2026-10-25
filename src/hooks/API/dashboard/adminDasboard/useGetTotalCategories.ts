import { axiosInstance } from "@/lib/axios";
import type { TotalCategoryResponse } from "@/types/dashboard";
import { useQuery } from "@tanstack/react-query";

export function useGetTotalCategories() {
  return useQuery({
    queryKey: ["admin", "total-categories"],
    queryFn: async () => {
      const { data } = await axiosInstance.get<TotalCategoryResponse>(
        "/admin/total-category",
      );

      return data;
    },
  });
}
