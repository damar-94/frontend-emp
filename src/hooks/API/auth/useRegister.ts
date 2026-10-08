import { axiosInstance } from "@/lib/axios";
import type { RegisterUserSchema } from "@/schemas_2/userAuth";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

function useRegister() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (values: RegisterUserSchema) => {
      await axiosInstance.post("/auth/register", {
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role,
        referralCode: values.referralCode,
      });
    },
    onSuccess: () => {
      toast.success("Register Success!");
      navigate("/login");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data.message || "Register Failed!");
    },
  });
}

export default useRegister;
