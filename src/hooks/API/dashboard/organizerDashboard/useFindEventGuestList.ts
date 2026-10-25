import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import type { OrganizerGuestListResponse } from "@/types/dashboard";

interface GetEventGuestListParams {
  eventId: number;
  page?: number;
  take?: number;
  search?: string;
  enabled?: boolean;
}

export const useFindEventGuestList = ({
  eventId,
  page = 1,
  take = 5,
  search = "",
  enabled = true,
}: GetEventGuestListParams) => {
  return useQuery<OrganizerGuestListResponse>({
    queryKey: ["guestList", eventId, page, take, search],
    queryFn: async () => {
      const { data } = await axiosInstance.get<OrganizerGuestListResponse>(
        `/organizer/my-events/${eventId}/guest-list`,
        {
          params: {
            page,
            take,
            search,
          },
        },
      );

      return data;
    },
    enabled: enabled && eventId > 0,
  });
};
