import { axiosInstance } from "@/lib/axios";
import { useAuth } from "@/stores/useAuth";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "react-toastify";

interface UploadProfilePictureResponse {
  message: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
    profilePicture: string | null;
  };
}

function useUploadProfilePicture() {
  const user = useAuth((state) => state.user);
  const updateProfilePicture = useAuth((state) => state.updateProfilePicture);

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("profilePicture", file);

      const response = await axiosInstance.patch<UploadProfilePictureResponse>(
        "/profile/picture",
        formData,
        {
          headers: {
            Authorization: `Bearer ${user?.accessToken}`,
          },
        },
      );

      return response.data;
    },

    onSuccess: (data) => {
      updateProfilePicture(data.user.profilePicture);
      toast.success("Profile picture updated successfully!");
    },

    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(
        error.response?.data.message || "Failed to update profile picture!",
      );
    },
  });
}

export default useUploadProfilePicture;
