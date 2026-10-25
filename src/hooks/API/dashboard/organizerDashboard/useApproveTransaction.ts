import { axiosInstance } from "@/lib/axios";
import type { OrganizerTransaction } from "@/types/dashboard";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "react-toastify";

interface ApproveTransactionResponse {
  message: string;
  transaction: {
    id: number;
    status: OrganizerTransaction["status"];
  };
}

function useApproveTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transactionId: number) => {
      const { data } = await axiosInstance.patch<ApproveTransactionResponse>(
        `/organizer/transactions/${transactionId}/approve`,
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
        error.response?.data.message || "Failed to approve transaction!",
      );
    },
  });
}

export default useApproveTransaction;
