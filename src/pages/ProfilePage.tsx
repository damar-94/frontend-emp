import { useRef, useState } from "react";
import {
  Camera,
  Check,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Pencil,
  Star,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const ProfilePage = () => {
  // =========================
  // Profile State
  // =========================

  const [name, setName] = useState("Kamal");
  const [email] = useState("kamal@example.com");

  const [profilePicture, setProfilePicture] = useState(
    "https://i.pravatar.cc/150?img=12",
  );

  const [referralCode] = useState("KAMAL123");
  const [points] = useState(10000);

  // Dummy password hash
  const [passwordHash] = useState(
    "$argon2id$v=19$m=65536,t=3,p=4$xxxxxxxxxxxxxxxx",
  );

  // =========================
  // Edit State
  // =========================

  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(name);

  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // =========================
  // Handlers
  // =========================

  const handleProfilePictureChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const imageUrl = URL.createObjectURL(file);

    setProfilePicture(imageUrl);
  };

  const handleSaveName = () => {
    if (!nameInput.trim()) return;

    setName(nameInput);
    setIsEditingName(false);
  };

  const handleCancelName = () => {
    setNameInput(name);
    setIsEditingName(false);
  };

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Please fill all password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("New password and confirmation password do not match.");
      return;
    }

    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    // Frontend only
    console.log({
      currentPassword,
      newPassword,
    });

    alert("Password changed successfully.");

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setIsChangingPassword(false);
  };

  // =========================
  // UI
  // =========================

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-4xl space-y-6">

        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Profile
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage your personal information and account settings.
          </p>
        </div>

        {/* =========================
            Profile Card
        ========================== */}

        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>

            <CardDescription>
              Manage your profile information.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">

            {/* Profile Picture */}

            <div className="flex items-center gap-6">
              <div className="relative">
                <img
                  src={profilePicture}
                  alt="Profile"
                  className="h-28 w-28 rounded-full object-cover border-4 border-white shadow-md"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-black text-white shadow-md transition hover:bg-slate-800"
                >
                  <Camera className="h-4 w-4" />
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  className="hidden"
                />
              </div>

              <div>
                <h3 className="font-semibold">
                  Profile Picture
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  Click the camera button to upload a new picture.
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  JPG, PNG or WEBP.
                </p>
              </div>
            </div>

            <Separator />

            {/* Name */}

            <div className="space-y-2">
              <Label htmlFor="name">
                Name
              </Label>

              {!isEditingName ? (
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                      id="name"
                      value={name}
                      readOnly
                      className="pl-10"
                    />
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditingName(true)}
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <Input
                    value={nameInput}
                    onChange={(event) =>
                      setNameInput(event.target.value)
                    }
                    placeholder="Enter your name"
                  />

                  <Button
                    type="button"
                    onClick={handleSaveName}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Save
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancelName}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>

            {/* Email */}

            <div className="space-y-2">
              <Label htmlFor="email">
                Email
              </Label>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="email"
                  value={email}
                  readOnly
                  className="pl-10 bg-muted"
                />
              </div>

              <p className="text-xs text-muted-foreground">
                Email address cannot be changed.
              </p>
            </div>

            {/* Referral Code */}

            <div className="space-y-2">
              <Label htmlFor="referralCode">
                Referral Code
              </Label>

              <Input
                id="referralCode"
                value={referralCode}
                readOnly
                className="bg-muted font-mono"
              />

              <p className="text-xs text-muted-foreground">
                Your referral code cannot be changed.
              </p>
            </div>

            {/* Points */}

            <div className="space-y-2">
              <Label>
                Points
              </Label>

              <div className="flex items-center gap-3 rounded-lg border bg-slate-50 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100">
                  <Star className="h-5 w-5 text-yellow-600" />
                </div>

                <div>
                  <p className="text-2xl font-bold">
                    {points.toLocaleString("id-ID")}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    Available points
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* =========================
            Security Card
        ========================== */}

        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>

            <CardDescription>
              Manage your account password.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">

            {/* Password Hash */}

            <div className="space-y-2">
              <Label htmlFor="passwordHash">
                Password
              </Label>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="passwordHash"
                  value={passwordHash}
                  readOnly
                  className="pl-10 pr-4 font-mono text-xs bg-muted"
                />
              </div>

              <p className="text-xs text-muted-foreground">
                Your password is stored securely as a hash.
              </p>
            </div>

            {!isChangingPassword ? (
              <Button
                type="button"
                onClick={() => setIsChangingPassword(true)}
              >
                <Lock className="mr-2 h-4 w-4" />
                Change Password
              </Button>
            ) : (
              <div className="space-y-5 rounded-lg border p-5">

                <div>
                  <h3 className="font-semibold">
                    Change Password
                  </h3>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Enter your current password and choose a new one.
                  </p>
                </div>

                {/* Current Password */}

                <div className="space-y-2">
                  <Label htmlFor="currentPassword">
                    Current Password
                  </Label>

                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={
                        showCurrentPassword
                          ? "text"
                          : "password"
                      }
                      value={currentPassword}
                      onChange={(event) =>
                        setCurrentPassword(event.target.value)
                      }
                      className="pr-10"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowCurrentPassword(
                          !showCurrentPassword,
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* New Password */}

                <div className="space-y-2">
                  <Label htmlFor="newPassword">
                    New Password
                  </Label>

                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={
                        showNewPassword
                          ? "text"
                          : "password"
                      }
                      value={newPassword}
                      onChange={(event) =>
                        setNewPassword(event.target.value)
                      }
                      className="pr-10"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowNewPassword(
                          !showNewPassword,
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Password must be at least 6 characters.
                  </p>
                </div>

                {/* Confirm Password */}

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">
                    Confirm New Password
                  </Label>

                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      value={confirmPassword}
                      onChange={(event) =>
                        setConfirmPassword(event.target.value)
                      }
                      className="pr-10"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          !showConfirmPassword,
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Actions */}

                <div className="flex gap-3">
                  <Button
                    type="button"
                    onClick={handleChangePassword}
                  >
                    Update Password
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsChangingPassword(false);
                      setCurrentPassword("");
                      setNewPassword("");
                      setConfirmPassword("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default ProfilePage;
