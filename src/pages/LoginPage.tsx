import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useLogin from "@/hooks/API/auth/useLogin";
import { loginSchema, type LoginSchema } from "@/schemas_2/userAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router";

const LoginPage = () => {
  const { register, handleSubmit, formState } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const { mutate, isPending } = useLogin();

  const handleLogin = async (values: LoginSchema) => {
    mutate(values);
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-repeat px-4"
      style={{
        backgroundImage: "url('/bg-login-page.jpg')",
      }}
    >
      <div className="w-full max-w-md rounded-[3rem_1.5rem_3rem_1.5rem] bg-white/95 p-8 shadow-xl backdrop-blur-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold">
            <span className="text-gray-900">Let’s get the </span>
            <span className="text-pink-600">fun</span>{" "}
            <span className="text-violet-500">started!</span>
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Sign in, <span className="font-medium text-pink-600">discover</span>{" "}
            new events, and{" "}
            <span className="font-medium text-amber-500">have fun.</span>
          </p>
        </div>

        <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
          {/* Email */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email
            </label>

            <Input
              id="email"
              type="email"
              {...register("email")}
              placeholder="iga@example.com"
              className="focus-visible:ring-pink-600"
            />
            {formState.errors.email && (
              <p className="text-red-500 text-sm">
                {formState.errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Password
            </label>

            <Input
              id="password"
              type="password"
              {...register("password")}
              placeholder="•••••••••••••••"
              className="focus-visible:ring-pink-600"
            />
            {formState.errors.password && (
              <p className="text-red-500 text-sm">
                {formState.errors.password.message}
              </p>
            )}
          </div>

          {/* Login Button */}
          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-pink-600 text-white hover:bg-pink-700"
          >
            {isPending ? "Loading" : "Submit"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          First time here?{" "}
          <Link
            to="/register"
            className="font-medium text-pink-600 hover:text-pink-700"
          >
            Come join us!
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
