import { axiosInstance } from "@/lib/axios";
import type { TotalCustomerResponse } from "@/types/dashboard";
import { useQuery } from "@tanstack/react-query";

export function useGetTotalCustomer() {
  return useQuery({
    queryKey: ["admin", "total-customers"],
    queryFn: async () => {
      const { data } = await axiosInstance.get<TotalCustomerResponse>(
        "/admin/total-customer",
      );
      return data;
    },
  });
}
