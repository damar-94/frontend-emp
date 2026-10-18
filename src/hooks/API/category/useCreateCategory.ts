import { axiosInstance } from "@/lib/axios";
import type { CreateCategorySchema } from "@/types/category.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "react-toastify";

function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: CreateCategorySchema) => {
      await axiosInstance.post("/categories", {
        name: values.name,
      });
    },
    onSuccess: () => {
      toast.success("Create Category Success!");

      // agar langsung menampilkan cetegory yg baru jika sukses dibuat
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data.message || "Create Category Failed!");
    },
  });
}

export default useCreateCategory;
