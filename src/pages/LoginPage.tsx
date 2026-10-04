import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log({
      email,
      password,
    });
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

        <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="iga@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="focus-visible:ring-pink-600"
            />
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
              placeholder="•••••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="focus-visible:ring-pink-600"
            />
          </div>

          {/* Login Button */}
          <Button
            type="submit"
            className="w-full bg-pink-600 text-white hover:bg-pink-700"
          >
            Login
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
