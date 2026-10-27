import { axiosInstance } from "@/lib/axios";
import type { DeleteEventResponse } from "@/types/dashboard";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "react-toastify";

export const useDeleteEvent = (eventId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await axiosInstance.delete<DeleteEventResponse>(
        `/organizer/my-events/${eventId}/delete-event`,
      );

      return data;
    },

    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: ["myEvents"],
      });

      toast.success(response.message || "Event deleted successfully!");
    },

    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data.message || "Failed to delete event!");
    },
  });
};
