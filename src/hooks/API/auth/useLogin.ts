import { axiosInstance } from "@/lib/axios";
import type { LoginSchema } from "@/schemas_2/userAuth";
import { useAuth } from "@/stores/useAuth";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

function useLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (values: LoginSchema) => {
      const { data } = await axiosInstance.post("/auth/login", {
        email: values.email,
        password: values.password,
      });
      return data;
    },
    onSuccess: (data) => {
      login({
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        profilePicture: data.user.profilePicture,
      });

      toast.success("Login Success!");

      navigate("/");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data.message || "Login Failed!");
    },
  });
}

export default useLogin;
