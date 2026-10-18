import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";

function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (categoryId: number) => {
      const response = await axiosInstance.delete(`/categories/${categoryId}`);

      return response.data;
    },

    onSuccess: () => {
      toast.success("Delete Category Success!");

      // agar langsung menampilkan list category terbaru setelah suskes menghapus
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },

    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data.message || "Delete Category Failed!");
    },
  });
}

export default useDeleteCategory;
