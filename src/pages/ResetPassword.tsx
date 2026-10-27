import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  resetPasswordSchema,
  type ResetPasswordSchema,
} from "@/schemas_2/resetPassword";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { HugeiconsIcon } from "@hugeicons/react";
import { ViewIcon, ViewOffSlashIcon } from "@hugeicons/core-free-icons";
import useResetPassword from "@/hooks/API/auth/useResetPassword";
import { useSearchParams } from "react-router";

function ResetPasswordPage() {
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const { mutate, isPending } = useResetPassword(token!);

  const onSubmit = (data: ResetPasswordSchema) => {
    mutate(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-repeat px-4 bg-[#fbf7f4]">
      <div className="w-full max-w-md rounded-[3rem_1.5rem_3rem_1.5rem] bg-white p-8 shadow-xl border border-[#f4917b]/30">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold">
            <span className="text-[#3d312e]">Reset </span>
            <span className="text-[#f4917b]">Password</span>
          </h1>

          <p className="mt-2 text-sm leading-relaxed text-[#3d312e]">
            Choose a new password for your account and make sure it’s easy for
            you to remember.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-semibold text-[#3d312e]"
            >
              New Password
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showNewPassword ? "text" : "password"}
                {...register("password")}
                placeholder="Your new password"
                autoComplete="off"
                aria-invalid={!!errors.password}
                className="focus-visible:ring-[#f4917b] focus-visible:border-[#f4917b] text-[#3d312e]"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                <HugeiconsIcon
                  icon={showNewPassword ? ViewIcon : ViewOffSlashIcon}
                  size={24}
                  color="currentColor"
                  strokeWidth={1.5}
                />
              </Button>
            </div>

            {errors.password && (
              <p className="text-sm text-red-600 font-medium">
                {errors.password.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label
              htmlFor="confirm-password"
              className="text-sm font-semibold text-[#3d312e]"
            >
              Confirm New Password
            </label>
            <div className="relative">
              <Input
                id="confirm-password"
                type={showPassword ? "text" : "password"}
                {...register("confirmPassword")}
                placeholder="Confirm your new password"
                autoComplete="off"
                aria-invalid={!!errors.confirmPassword}
                className="focus-visible:ring-[#f4917b] focus-visible:border-[#f4917b] text-[#3d312e]"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0"
                onClick={() => setShowPassword(!showPassword)}
              >
                <HugeiconsIcon
                  icon={showPassword ? ViewIcon : ViewOffSlashIcon}
                  size={24}
                  color="currentColor"
                  strokeWidth={1.5}
                />
              </Button>
            </div>

            {errors.confirmPassword && (
              <p className="text-sm text-red-600 font-medium">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-[#f4917b] text-white hover:bg-[#df7d67] font-medium"
          >
            {isPending ? "Loading..." : "Send Reset Link"}
            Reset Password
          </Button>
        </form>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
