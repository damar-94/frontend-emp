import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import type { FindOrganizerEvents } from "@/types/dashboard";

export const useFindMyEvents = () => {
  return useQuery<FindOrganizerEvents>({
    queryKey: ["myEvents"],
    queryFn: async () => {
      const { data } = await axiosInstance.get<FindOrganizerEvents>(
        "/organizer/my-events",
      );
      return data;
    },
  });
};
