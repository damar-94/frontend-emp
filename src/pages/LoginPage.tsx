import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useLogin from "@/hooks/API/auth/useLogin";
import { loginSchema, type LoginSchema } from "@/schemas_2/userAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeClosedIcon, EyeIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { register, handleSubmit, formState } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const { mutate, isPending } = useLogin();

  const handleLogin = async (values: LoginSchema) => {
    mutate(values);
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-repeat px-4 bg-[#fbf7f4]"
      style={{
        backgroundImage: "url('/bg-login-page.jpg')",
      }}
    >
      <div className="w-full max-w-md rounded-[3rem_1.5rem_3rem_1.5rem] bg-white p-8 shadow-xl border border-[#f4917b]/30">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold">
            <span className="text-[#3d312e]">Let’s get the </span>
            <span className="text-[#f7542f]">fun</span>{" "}
            <span className="text-[#5a8a83]">started!</span>
          </h1>

          <p className="mt-2 text-sm text-[#3d312e]">
            Sign in,{" "}
            <span className="font-medium text-[#f7542f]">discover</span> new
            events, and{" "}
            <span className="font-medium text-[#5a8a83]">have fun.</span>
          </p>
        </div>

        <form
          onSubmit={handleSubmit(handleLogin)}
          className="space-y-4"
          noValidate
        >
          {/* Email */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-semibold text-[#3d312e]"
            >
              Email
            </label>

            <Input
              id="email"
              type="email"
              {...register("email")}
              placeholder="iga@example.com"
              className="focus-visible:ring-[#f4917b] focus-visible:border-[#f4917b] border-[#f4917b]/60 text-[#3d312e]"
            />
            {formState.errors.email && (
              <p className="text-red-600 text-sm font-medium">
                {formState.errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-semibold text-[#3d312e]"
            >
              Password
            </label>

            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="•••••••••••••••"
                className="focus-visible:ring-[#f4917b] focus-visible:border-[#f4917b] border-[#f4917b]/60 text-[#3d312e]"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0"
                onClick={() => setShowPassword(!showPassword)}
              >
                <HugeiconsIcon
                  icon={showPassword ? EyeIcon : EyeClosedIcon}
                  size={24}
                  color="currentColor"
                  strokeWidth={1.5}
                />
              </Button>
            </div>

            {formState.errors.password && (
              <p className="text-red-600 text-sm font-medium">
                {formState.errors.password.message}
              </p>
            )}
          </div>
          <div className="grid gap-1">
            {/* Login Button */}
            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-[#f7542f] text-white hover:bg-[#df7d67] font-medium"
            >
              {isPending ? "Loading" : "Submit"}
            </Button>

            {/* Forgotten Password Button */}

            <Link
              to="/forgot-password"
              className="w-full text-[#f7542f] hover:text-[#df7d67] text-sm text-center font-medium"
            >
              Forgotten Password
            </Link>
          </div>
        </form>

        <p className="mt-3 text-center text-sm text-[#3d312e]">
          First time here?{" "}
          <Link
            to="/register"
            className="font-medium text-[#f7542f] hover:text-[#df7d67]"
          >
            Come join us!
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
