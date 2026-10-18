import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useRegister from "@/hooks/API/auth/useRegister";
import {
  registerUserSchema,
  type RegisterUserSchema,
} from "@/schemas_2/userAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router";

function RegisterPage() {
  const { register, handleSubmit, formState } = useForm<RegisterUserSchema>({
    resolver: zodResolver(registerUserSchema),
  });

  const {mutate, isPending} = useRegister();

  const handleRegister = async (values: RegisterUserSchema) => {
    mutate(values)
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-repeat px-4 py-8 bg-[#fbf7f4]"
      style={{
        backgroundImage: "url('/bg-login-page.jpg')",
      }}
    >
      <div className="w-full max-w-md rounded-[3rem_1.5rem_3rem_1.5rem] bg-white p-8 shadow-xl border border-[#f4917b]/30">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold">
            <span className="text-[#3d312e]">Let’s </span>
            <span className="text-[#f7542f]">get you</span>{" "}
            <span className="text-[#5a8a83]">started!</span>
          </h1>

          <p className="mt-2 text-sm text-[#3d312e]">
            Create an account,{" "}
            <span className="font-medium text-[#f7542f]">discover</span> new
            events, and{" "}
            <span className="font-medium text-[#5a8a83]">have fun.</span>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(handleRegister)} className="space-y-4" noValidate>
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-semibold text-[#3d312e]">
              Name
            </Label>

            <Input
              id="name"
              placeholder="Iga Massardi"
              type="text"
              {...register("name")}
              className="focus-visible:ring-[#f4917b] focus-visible:border-[#f4917b] border-[#f4917b]/60 text-[#3d312e]"
            />

            {formState.errors.name && (
              <p className="text-sm text-red-600 font-medium">
                {formState.errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-semibold text-[#3d312e]"
            >
              Email
            </Label>

            <Input
              id="email"
              placeholder="ikanbelida@example.com"
              type="email"
              {...register("email")}
              className="focus-visible:ring-[#f4917b] focus-visible:border-[#f4917b] border-[#f4917b]/60 text-[#3d312e]"
            />

            {formState.errors.email && (
              <p className="text-sm text-red-600 font-medium">
                {formState.errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-sm font-semibold text-[#3d312e]"
            >
              Password
            </Label>

            <Input
              id="password"
              placeholder="••••••••"
              type="password"
              {...register("password")}
              className="focus-visible:ring-[#f4917b] focus-visible:border-[#f4917b] border-[#f4917b]/60 text-[#3d312e]"
            />

            {formState.errors.password && (
              <p className="text-sm text-red-600 font-medium">
                {formState.errors.password.message}
              </p>
            )}
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label htmlFor="role" className="text-sm font-semibold text-[#3d312e]">
              Role
            </Label>

            <select
              id="role"
              className="flex h-10 w-full rounded-md border border-[#f4917b]/60 bg-background px-3 py-2 text-sm text-[#3d312e] outline-none focus:border-[#f4917b] focus:ring-2 focus:ring-[#f4917b]/20"
              {...register("role")}
            >
              <option value="CUSTOMER">Customer</option>
              <option value="EVENTORGANIZER">Event Organizer</option>
            </select>
          </div>

          {/* Referral Code */}
          <div className="space-y-2">
            <Label
              htmlFor="referralCode"
              className="text-sm font-semibold text-[#3d312e]"
            >
              Referral Code
            </Label>

            <Input
              id="referralCode"
              placeholder="Enter referral code"
              type="text"
              {...register("referralCode")}
              className="focus-visible:ring-[#f4917b] focus-visible:border-[#f4917b] border-[#f4917b]/60 text-[#3d312e]"
            />
          </div>

          {/* Register Button */}
          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-[#f7542f] text-white hover:bg-[#df7d67] font-medium"
          >
            {isPending ? "Loading" : "Register"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-[#3d312e]">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-[#f7542f] hover:text-[#df7d67]"
          >
            Come back!
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;