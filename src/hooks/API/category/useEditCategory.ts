import { axiosInstance } from "@/lib/axios";
import type { EditCategorySchema } from "@/types/category.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "react-toastify";

function useEditCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: EditCategorySchema) => {
      await axiosInstance.patch(`/categories/${values.id}`, {
        name: values.name,
      });
    },
    onSuccess: () => {
      toast.success("Edit Category Success!");

      // agar langsung menampilkan cetegory yg baru jika sukses dibuat
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data.message || "Edit Category Failed!");
    },
  });
}

export default useEditCategory;
