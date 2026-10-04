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
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-sm">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold">Create an Account</h1>

          <p className="mt-2 text-sm text-gray-500">Register to get started</p>
        </div>

        {/* form */}
        <form onSubmit={handleSubmit(handleRegister)} className="space-y-4">
          {/* name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Name
            </Label>
            <Input
              id="name"
              placeholder="Iga Massardi"
              type="text"
              {...register("name")}
            />
            {formState.errors.name && (
              <p className="text-red-500 text-sm">
                {formState.errors.name.message}
              </p>
            )}
          </div>
          {/* email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email
            </Label>
            <Input
              id="email"
              placeholder="ikanbelida@example.com"
              type="email"
              {...register("email")}
            />
            {formState.errors.email && (
              <p className="text-red-500 text-sm">
                {formState.errors.email.message}
              </p>
            )}
          </div>
          {/* password */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Password
            </Label>
            <Input
              id="password"
              placeholder="••••••••"
              type="password"
              {...register("password")}
            />
            {formState.errors.password && (
              <p className="text-red-500 text-sm">
                {formState.errors.password.message}
              </p>
            )}
          </div>

          {/* role */}
          <div className="space-y-2">
            <Label htmlFor="role" className="text-sm font-medium">
              Role
            </Label>
            <select
              id="role"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              {...register("role")}
            >
              <option value="CUSTOMER">Customer</option>
              <option value="EVENTORGANIZER">Event Organizer</option>
            </select>
          </div>

          {/* Referral Code */}
          <div className="space-y-2">
            <Label htmlFor="referralCode" className="text-sm font-medium">
              Referral Code
            </Label>
            <Input
              id="referralCode"
              placeholder="Enter referral code"
              type="text"
              {...register("referralCode")}
            />
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Loading" : "Register"}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-primary hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
