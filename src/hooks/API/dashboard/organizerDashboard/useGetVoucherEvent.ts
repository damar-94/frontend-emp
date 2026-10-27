import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import type { OrganizerEventVoucher } from "@/types/dashboard";

export function useGetVoucherEvent(eventId: number) {
  return useQuery<OrganizerEventVoucher[], Error>({
    queryKey: ["organizer", "voucher", eventId],
    queryFn: async () => {
      const { data } = await axiosInstance.get<OrganizerEventVoucher[]>(
        `/organizer/my-events/${eventId}/vouchers`,
      );

      return data;
    },
    enabled: eventId > 0,
  });
}
