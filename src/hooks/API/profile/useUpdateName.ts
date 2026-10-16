import { axiosInstance } from "@/lib/axios";
import { useAuth } from "@/stores/useAuth";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "react-toastify";

interface UpdateNameResponse {
  message: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
    profilePicture: string | null;
  };
}

function useUpdateName() {
  const user = useAuth((state) => state.user);
  const updateName = useAuth((state) => state.updateName);

  return useMutation({
    mutationFn: async (name: string) => {
      const response = await axiosInstance.patch<UpdateNameResponse>(
        "/profile/name",
        { name },
        {
          headers: {
            Authorization: `Bearer ${user?.accessToken}`,
          },
        },
      );

      return response.data;
    },

    onSuccess: (data) => {
      updateName(data.user.name);
      toast.success("Name updated successfully!");
    },

    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data.message || "Failed to update name!");
    },
  });
}

export default useUpdateName;
