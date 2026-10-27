import { axiosInstance } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";

export const useUpdateEvent = (eventId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await axiosInstance.put(
        `/organizer/my-events/${eventId}`,
        formData,
      );

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["myEvents"],
      });

      toast.success(data.message || "Event berhasil diperbarui");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(
        error.response?.data?.message || "Gagal memperbarui event",
      );
    },
  });
};
