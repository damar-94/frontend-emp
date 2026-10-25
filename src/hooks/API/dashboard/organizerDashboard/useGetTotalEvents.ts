import { axiosInstance } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export function useGetOrganizerTotalEvents() {
  return useQuery({
    queryKey: ["organizer", "total-events"],
    queryFn: async () => {
      const { data } = await axiosInstance.get<number>(
        "/organizer/total-events",
      );
      return data;
    },
  });
}
