import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useForgotPassword from "@/hooks/API/auth/useForgotPassword";
import {
  forgotPasswordSchema,
  type ForgotPasswordSchema,
} from "@/schemas_2/forgotPassword";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router";

function ForgotPasword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const { mutate, isPending } = useForgotPassword();

  const onSubmit = (data: ForgotPasswordSchema) => {
    mutate(data);
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-repeat px-4 bg-[#fbf7f4]"
      style={{
        backgroundImage: "url('/bg-login-page.jpg')",
      }}
    >
      <div className="w-full max-w-md rounded-[3rem_1.5rem_3rem_1.5rem] bg-white p-8 shadow-xl border border-[#f4917b]/30">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold">
            <span className="text-[#3d312e]">Forgot </span>
            <span className="text-[#f7542f]">Password</span>
            <span className="text-[#5a8a83]">?</span>
          </h1>

          <p className="mt-2 text-sm leading-relaxed text-[#3d312e]">
            Enter your email address and we will send you a link to reset
            your password.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              placeholder="Your Email"
              autoComplete="email"
              aria-invalid={!!errors.email}
              className="focus-visible:ring-[#f4917b] focus-visible:border-[#f4917b] border-[#f4917b]/60 text-[#3d312e]"
            />

            {errors.email && (
              <p className="text-sm text-red-600 font-medium">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-[#f7542f] text-white hover:bg-[#df7d67] font-medium"
          >
            {isPending ? "Loading..." : "Send Reset Link"}
          </Button>
        </form>

        {/* Back to Login */}
        <p className="mt-5 text-center text-sm text-[#3d312e]">
          Remember your password?{" "}
          <Link
            to="/login"
            className="font-medium text-[#f7542f] hover:text-[#df7d67]"
          >
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPasword;