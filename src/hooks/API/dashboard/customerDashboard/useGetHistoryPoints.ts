import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import type {
  PointsHistoryParams,
  PointsHistoryResponse,
} from "@/types/dashboard";

export const useGetCustomerHistoryPoints = ({
  page = 1,
  take = 5,
}: PointsHistoryParams = {}) => {
  return useQuery<PointsHistoryResponse>({
    queryKey: ["customer", "points-history", page, take],
    queryFn: async () => {
      const { data } = await axiosInstance.get<PointsHistoryResponse>(
        "/customer/points-history",
        {
          params: { page, take },
        },
      );

      return data;
    },
  });
};
