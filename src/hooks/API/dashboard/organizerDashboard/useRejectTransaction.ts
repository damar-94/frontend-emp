import { axiosInstance } from "@/lib/axios";
import type { OrganizerTransaction } from "@/types/dashboard";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "react-toastify";

interface RejectTransactionResponse {
  message: string;
  transaction: {
    id: number;
    status: OrganizerTransaction["status"];
  };
}

export function useRejectTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transactionId: number) => {
      const { data } = await axiosInstance.patch<RejectTransactionResponse>(
        `/organizer/transactions/${transactionId}/reject`,
      );

      return data;
    },

    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: ["organizer", "table-transactions"],
      });

      toast.success(response.message);
    },

    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(
        error.response?.data.message || "Failed to reject transaction!",
      );
    },
  });
}
