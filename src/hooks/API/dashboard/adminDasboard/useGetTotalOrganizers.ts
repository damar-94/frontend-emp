import { axiosInstance } from "@/lib/axios";
import type {
    TotalOrganizerResponse
} from "@/types/dashboard";
import { useQuery } from "@tanstack/react-query";

export function useGetTotalOrganizer() {
  return useQuery({
    queryKey: ["admin", "total-organizers"],
    queryFn: async () => {
      const { data } = await axiosInstance.get<TotalOrganizerResponse>(
        "/admin/total-organizer",
      );
      return data;
    },
  });
}
