import { axiosInstance } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export function useGetTotalTransactions() {
  return useQuery({
    queryKey: ["organizer", "total-transactions"],
    queryFn: async () => {
      const { data } = await axiosInstance.get<number>(
        "/organizer/total-transactions",
      );
      return data;
    },
  });
}
