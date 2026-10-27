import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";

export const useGetCustomerPoints = () => {
  return useQuery<number>({
    queryKey: ["customer", "total-points"],
    queryFn: async () => {
      const { data } = await axiosInstance.get<number>(
        "/customer/total-points",
      );

      return data;
    },
  });
};
