import { axiosInstance } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export function useGetTotalDonePayment() {
  return useQuery({
    queryKey: ["organizer", "total-done-payment"],
    queryFn: async () => {
      const { data } = await axiosInstance.get<number>(
        "/organizer/total-done-payments",
      );
      return data;
    },
  });
}