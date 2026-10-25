import { axiosInstance } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export function useGetTotalRejectedPayment() {
  return useQuery({
    queryKey: ["organizer", "total-rejected-payment"],
    queryFn: async () => {
      const { data } = await axiosInstance.get<number>(
        "/organizer/total-rejected-payments",
      );
      return data;
    },
  });
}