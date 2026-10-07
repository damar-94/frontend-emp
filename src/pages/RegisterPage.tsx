import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { axiosInstance } from "@/lib/axios";
import {
  registerUserSchema,
  type RegisterUserSchema,
} from "@/schemas_2/userAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { Link } from "react-router";

function RegisterPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { register, handleSubmit, formState } = useForm<RegisterUserSchema>({
    resolver: zodResolver(registerUserSchema),
  });

  const navigate = useNavigate();

  const handleRegister = async (values: RegisterUserSchema) => {
    setIsLoading(true);
    try {
      await axiosInstance.post("/auth/register", {
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role,
        referralCode: values.referralCode,
      });

      alert("Register Success!");

      navigate("/login");
    } catch (error) {
      console.log(error);
      alert("Register Failed!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-repeat px-4 py-8"
      style={{
        backgroundImage: "url('/bg-login-page.jpg')",
      }}
    >
      <div className="w-full max-w-md rounded-[3rem_1.5rem_3rem_1.5rem] bg-white/95 p-8 shadow-xl backdrop-blur-sm">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold">
            <span className="text-gray-900">Let’s </span>
            <span className="text-pink-600">get you</span>{" "}
            <span className="text-violet-500">started!</span>
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Create an account,{" "}
            <span className="font-medium text-pink-600">discover</span> new
            events, and{" "}
            <span className="font-medium text-amber-500">have fun.</span>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(handleRegister)} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label
              htmlFor="name"
              className="text-sm font-medium text-gray-700"
            >
              Name
            </Label>

            <Input
              id="name"
              placeholder="Iga Massardi"
              type="text"
              {...register("name")}
              className="focus-visible:ring-pink-600"
            />

            {formState.errors.name && (
              <p className="text-sm text-red-500">
                {formState.errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email
            </Label>

            <Input
              id="email"
              placeholder="ikanbelida@example.com"
              type="email"
              {...register("email")}
              className="focus-visible:ring-pink-600"
            />

            {formState.errors.email && (
              <p className="text-sm text-red-500">
                {formState.errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Password
            </Label>

            <Input
              id="password"
              placeholder="••••••••"
              type="password"
              {...register("password")}
              className="focus-visible:ring-pink-600"
            />

            {formState.errors.password && (
              <p className="text-sm text-red-500">
                {formState.errors.password.message}
              </p>
            )}
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label
              htmlFor="role"
              className="text-sm font-medium text-gray-700"
            >
              Role
            </Label>

            <select
              id="role"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-pink-600 focus:ring-2 focus:ring-pink-600/20"
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
              className="text-sm font-medium text-gray-700"
            >
              Referral Code
            </Label>

            <Input
              id="referralCode"
              placeholder="Enter referral code"
              type="text"
              {...register("referralCode")}
              className="focus-visible:ring-pink-600"
            />
          </div>

          {/* Register Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-pink-600 text-white hover:bg-pink-700"
          >
            {isLoading ? "Loading" : "Register"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-pink-600 hover:text-pink-700"
          >
            Come back!
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;