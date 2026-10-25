import { axiosInstance } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export function useGetTotalTicketSold() {
  return useQuery({
    queryKey: ["organizer", "total-tickets-sold"],
    queryFn: async () => {
      const { data } = await axiosInstance.get<number>(
        "/organizer/total-ticket-sold",
      );
      return data;
    },
  });
}