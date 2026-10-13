import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import { Coins } from "lucide-react";

export default function ProfilePage() {
  const [name, setName] = useState("Kamal");
  const [email] = useState("kamal@example.com");
  const [profilePicture, setProfilePicture] = useState("");
  const [preview, setPreview] = useState("");

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran gambar maksimal 2 MB");
      return;
    }

    setProfilePicture(URL.createObjectURL(file));
    setPreview(file.name);
  };

  const handleUpdateProfile = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    alert("Frontend demo: profil berhasil disimpan");
  };

  const handleChangePassword = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    alert("Frontend demo: password berhasil diubah");
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage your profile and account security.
          </p>
        </div>

        {/* Profile Summary */}

        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <Avatar className="h-14 w-14 shrink-0">
              <AvatarImage src={profilePicture} />
              <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>

            <div className="min-w-0">
              <h2 className="font-semibold">{name}</h2>
              <p className="truncate text-sm text-muted-foreground">{email}</p>

              <span className="mt-1 inline-block rounded-full bg-pink-100 px-2 py-0.5 text-xs font-medium text-pink-700">
                Customer
              </span>
            </div>

            <div className="flex shrink-0 items-center gap-2 border-l pl-4">
              <Coins className="h-5 w-5 text-pink-600" />

              <div>
                <p className="text-xs text-muted-foreground">Points</p>
                <p className="font-bold text-pink-600">10,000</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Profile */}
        <Card>
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
            <CardDescription>Update your personal information.</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="photo">Profile Picture</Label>
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                />
                {preview && (
                  <p className="text-xs text-muted-foreground">
                    Selected: {preview}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" value={email} disabled />
              </div>

              <Button type="submit" className="bg-pink-600 hover:bg-pink-700">
                Save Changes
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>
              Update your password to keep your account secure.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleChangePassword} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  placeholder="Enter current password"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter new password"
                  minLength={8}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  minLength={8}
                  required
                />
              </div>

              <Button type="submit" variant="outline">
                Change Password
              </Button>
            </form>

            <Separator className="my-6" />

            {/* Reset Password */}
            <div className="space-y-3">
              <div>
                <h3 className="font-medium">Forgot your password?</h3>
                <p className="text-sm text-muted-foreground">
                  Reset your password using your registered email.
                </p>
              </div>

              <Button
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
    </main>
  );
}
