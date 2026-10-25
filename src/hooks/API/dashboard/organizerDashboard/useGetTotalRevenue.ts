import { axiosInstance } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export function useGetTotalRevenue() {
  return useQuery({
    queryKey: ["organizer", "total-revenue"],
    queryFn: async () => {
      const { data } = await axiosInstance.get<number>(
        "/organizer/total-revenue",
      );
      return data;
    },
  });
}




