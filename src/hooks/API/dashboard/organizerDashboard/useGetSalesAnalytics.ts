import { axiosInstance } from "@/lib/axios";
import type { SalesAnalyticsItem, SalesPeriod } from "@/types/dashboard";
import { useQuery } from "@tanstack/react-query";

export function useGetOrganizerSalesAnalytics(
  period: SalesPeriod,
  selectedDate: string,
) {
  return useQuery({
    queryKey: ["organizer", "sales-analytics", period, selectedDate],
    queryFn: async () => {
      const { data } = await axiosInstance.get<SalesAnalyticsItem[]>(
        "/organizer/sales-analytics",
        {
          params: {
            period,
            selectedDate,
          },
        },
      );

      return data;
    },
  });
}
