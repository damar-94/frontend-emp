import { axiosInstance } from "@/lib/axios";
import type { TotalEventResponse } from "@/types/dashboard";
import { useQuery } from "@tanstack/react-query";

export function useGetTotalEvents() {
  return useQuery({
    queryKey: ["admin", "total-events"],
    queryFn: async () => {
      const { data } = await axiosInstance.get<TotalEventResponse>(
        "/admin/total-event",
      );

      return data;
    },
  });
}