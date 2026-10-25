import { axiosInstance } from "@/lib/axios";
import type { GetUsersParams, GetUsersResponse } from "@/types/dashboard";
import { useQuery } from "@tanstack/react-query";

export const useGetUsers = (params: GetUsersParams) => {
  return useQuery({
    queryKey: ["admin", "users", params],
    queryFn: async () => {
      const { data } = await axiosInstance.get<GetUsersResponse>(
        "/admin/users",
        {
          params: {
            ...params,
            role: params.role === "ALL" ? undefined : params.role,
          },
        },
      );

      return data;
    },
  });
};
