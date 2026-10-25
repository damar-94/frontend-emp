import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import useChangePassword from "@/hooks/API/auth/useChangePassword";
import {
  changePasswordSchema,
  type ChangePasswordSchema,
} from "@/schemas_2/changePassword";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeClosedIcon, EyeIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { useForm } from "react-hook-form";

export function ChangePasswordUser() {
  const [showCurrentPassword, setShowCurrentPassword] =
    useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const changePasswordMutation = useChangePassword();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordSchema>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onChangePassword = (values: ChangePasswordSchema) => {
    changePasswordMutation.mutate(values, {
      onSuccess: () => {
        reset();
      },
    });
  };

  return (
    <div className="w-full space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Change Password
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Update your password to keep your account secure.
        </p>
      </div>

      {/* Change Password Form */}
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onChangePassword)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>

              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="Please enter your current password"
                  {...register("currentPassword")}
                />

                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  <HugeiconsIcon
                    icon={showCurrentPassword ? EyeIcon : EyeClosedIcon}
                    size={24}
                    color="currentColor"
                    strokeWidth={1.5}
                  />
                </Button>
              </div>

              {errors.currentPassword && (
                <p className="text-sm text-red-500">
                  {errors.currentPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Please enter your new password"
                  {...register("newPassword")}
                />

                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  <HugeiconsIcon
                    icon={showNewPassword ? EyeIcon : EyeClosedIcon}
                    size={24}
                    color="currentColor"
                    strokeWidth={1.5}
                  />
                </Button>
              </div>

              {errors.newPassword && (
                <p className="text-sm text-red-500">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>

              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Please confirm your new password"
                  {...register("confirmPassword")}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <HugeiconsIcon
                    icon={showConfirmPassword ? EyeIcon : EyeClosedIcon}
                    size={24}
                    color="currentColor"
                    strokeWidth={1.5}
                  />
                </Button>
              </div>

              {errors.confirmPassword && (
                <p className="text-sm text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              variant="outline"
              disabled={changePasswordMutation.isPending}
            >
              {changePasswordMutation.isPending
                ? "Changing Password..."
                : "Change Password"}
            </Button>
          </form>

          <Separator className="my-6" />

          {/* Reset Password */}
          <div className="space-y-3">
            <div>
              <h3 className="font-medium">Password Recovery</h3>
              <p className="text-sm text-muted-foreground">
                Need to update your password? You can reset it securely using
                your registered email address.{" "}
              </p>
            </div>

            <Button
              type="button"
              variant="link"
              className="h-auto p-0 text-pink-600"
              onClick={() => window.location.assign("/forgot-password")}
            >
              Reset Password
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
