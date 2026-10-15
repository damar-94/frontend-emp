import { axiosInstance } from "@/lib/axios";
import type { ResetPasswordSchema } from "@/schemas_2/resetPassword";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

function useResetPassword(token?: string) {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (values: ResetPasswordSchema) => {
      await axiosInstance.post(
        "/auth/reset-password",
        {
          password: values.password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    },
    onSuccess: () => {
      toast.success("Reset Password Success!");
      navigate("/");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data.message || "Reset Password failed!");
    },
  });
}

export default useResetPassword;
