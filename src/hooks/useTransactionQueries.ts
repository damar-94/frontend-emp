import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import type { TransactionDetailModel } from "@/types/transaction.types";
import type { Transaction, TransactionStatus } from "@/pages/dashboards/customer/CustomerTransactions";
import type { PaginationMeta } from "@/types/pagination.types";

export interface CustomerTransactionsQueryParams {
  page: number;
  take: number;
  status?: TransactionStatus | "ALL";
  search?: string;
}

export interface PaginatedTransactionsResponse {
  success: boolean;
  data: Transaction[];
  meta: PaginationMeta;
}

// 1. Query: Paginated Customer Transactions (GET /transactions)
export const useCustomerTransactionsQuery = (
  filters: CustomerTransactionsQueryParams,
) => {
  return useQuery<PaginatedTransactionsResponse>({
    queryKey: ["customer-transactions", filters],
    queryFn: async () => {
      const params: Record<string, any> = {
        page: filters.page,
        take: filters.take,
      };
      if (filters.status && filters.status !== "ALL") {
        params.status = filters.status;
      }
      if (filters.search && filters.search.trim() !== "") {
        params.search = filters.search.trim();
      }

      const res = await axiosInstance.get<PaginatedTransactionsResponse>(
        "/transactions",
        { params },
      );
      return res.data;
    },
    placeholderData: keepPreviousData,
  });
};

// 2. Query: Single Transaction Detail (GET /transactions/:id)
export const useTransactionDetailQuery = (transactionId?: string) => {
  return useQuery<TransactionDetailModel>({
    queryKey: ["transaction", transactionId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/transactions/${transactionId}`);
      return res.data.data;
    },
    enabled: Boolean(transactionId),
  });
};

// 3. Mutation: Upload or Re-upload Payment Proof (PATCH /transactions/:id/payment-proof)
export const useUploadPaymentProofMutation = (transactionId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("paymentProof", file);

      const res = await axiosInstance.patch(
        `/transactions/${transactionId}/payment-proof`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      return res.data.data as TransactionDetailModel;
    },
    onSuccess: (updatedTransaction) => {
      // Immediately update the detail cache and invalidate the paginated list
      queryClient.setQueryData(
        ["transaction", transactionId],
        updatedTransaction,
      );
      queryClient.invalidateQueries({ queryKey: ["customer-transactions"] });
    },
  });
};

// 4. Mutation: Submit Event Review (POST /reviews)
export const useSubmitReviewMutation = (transactionId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      transactionId: number;
      rating: number;
      comment: string;
    }) => {
      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("accessToken") ||
        localStorage.getItem("jwt");

      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

      const res = await axiosInstance.post("/reviews", payload, { headers });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["transaction", transactionId],
      });
      queryClient.invalidateQueries({ queryKey: ["customer-transactions"] });
    },
  });
};