import { axiosInstance } from "@/lib/axios";
import type { ChangePasswordSchema } from "@/schemas_2/changePassword";
import { useAuth } from "@/stores/useAuth";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "react-toastify";

function useChangePassword() {
  const user = useAuth((state) => state.user);

  return useMutation({
    mutationFn: async (values: ChangePasswordSchema) => {
      await axiosInstance.post(
        "/auth/change-password",
        {
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.accessToken}`,
          },
        },
      );
    },
    onSuccess: () => {
      toast.success("Change Password Success!");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(
        error.response?.data.message || "Change Password failed!",
      );
    },
  });
}

export default useChangePassword;
