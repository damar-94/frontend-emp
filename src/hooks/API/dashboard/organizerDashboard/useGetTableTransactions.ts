import { axiosInstance } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import type {
  PaginationQueryParams,
  PaginationResponse,
} from "@/types/pagination";
import type { OrganizerTransaction, TransactionStatusFilter } from "@/types/dashboard";

interface OrganizerTransactionsParams extends PaginationQueryParams {
  status: TransactionStatusFilter;
}

export function useGetOrganizerTransactions({
  page = 1,
  take = 10,
  search = "",
  status = "ALL",
}: OrganizerTransactionsParams) {
  return useQuery({
    queryKey: ["organizer", "table-transactions", page, take, search, status],
    queryFn: async () => {
      const { data } = await axiosInstance.get<
        PaginationResponse<OrganizerTransaction>
      >("/organizer/table-transactions", {
        params: {
          page,
          take,
          search,
          status,
        },
      });

      return data;
    },
  });
}
