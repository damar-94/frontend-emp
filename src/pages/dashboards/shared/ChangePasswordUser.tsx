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
import { useForm } from "react-hook-form";

export function ChangePasswordUser() {
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
              <Input
                id="currentPassword"
                type="password"
                placeholder="Please enter your current password"
                {...register("currentPassword")}
              />
              {errors.currentPassword && (
                <p className="text-sm text-red-500">
                  {errors.currentPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="Please enter your new password"
                {...register("newPassword")}
              />
              {errors.newPassword && (
                <p className="text-sm text-red-500">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Please confirm your new password"
                {...register("confirmPassword")}
              />
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
              <h3 className="font-medium">Forgot your password?</h3>
              <p className="text-sm text-muted-foreground">
                You can reset your password using your registered email address.
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
