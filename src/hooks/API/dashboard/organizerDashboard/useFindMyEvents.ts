import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import type { PaginationQueryParams } from "@/types/pagination";
import type { FindOrganizerEvents } from "@/types/dashboard";

interface FindMyEventsParams extends PaginationQueryParams {
  search?: string;
}

export const useFindMyEvents = ({
  page = 1,
  take = 6,
  search = "",
}: FindMyEventsParams = {}) => {
  return useQuery<FindOrganizerEvents>({
    queryKey: ["myEvents", page, take, search],
    queryFn: async () => {
      const { data } = await axiosInstance.get<FindOrganizerEvents>(
        "/organizer/my-events",
        {
          params: { page, take, search },
        },
      );

      return data;
    },
  });
};