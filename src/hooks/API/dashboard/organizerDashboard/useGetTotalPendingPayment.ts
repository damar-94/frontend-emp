import { axiosInstance } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export function useGetTotalPendingPayment() {
  return useQuery({
    queryKey: ["organizer", "total-pending-payment"],
    queryFn: async () => {
      const { data } = await axiosInstance.get<number>(
        "/organizer/total-pending-payments",
      );
      return data;
    },
  });
}