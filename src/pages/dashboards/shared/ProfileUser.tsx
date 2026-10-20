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
import useUpdateName from "@/hooks/API/profile/useUpdateName";
import useUploadProfilePicture from "@/hooks/API/profile/useUploadProfilePicture";
import {
  updateNameSchema,
  type UpdateNameSchema,
} from "@/schemas_2/updateName";
import { useAuth } from "@/stores/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Coins } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

export function ProfileUser() {
  const user = useAuth((state) => state.user);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const uploadProfilePictureMutation = useUploadProfilePicture();
  const updateNameMutation = useUpdateName();

  const {
    register: registerName,
    handleSubmit: handleNameSubmit,
    reset: resetName,
    formState: { errors: nameErrors },
  } = useForm<UpdateNameSchema>({
    resolver: zodResolver(updateNameSchema),
    defaultValues: {
      name: user?.name ?? "",
    },
  });

  useEffect(() => {
    resetName({
      name: user?.name ?? "",
    });
  }, [user?.name, resetName]);

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Please select an image that is no larger than 2 MB.");
      event.target.value = "";
      setSelectedFile(null);
      return;
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      alert("Please select an image in JPEG, PNG, or WebP format.");
      event.target.value = "";
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleUploadProfilePicture = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!selectedFile) return;

    uploadProfilePictureMutation.mutate(selectedFile, {
      onSuccess: () => {
        setSelectedFile(null);

        if (photoInputRef.current) {
          photoInputRef.current.value = "";
        }
      },
    });
  };

  const handleUpdateName = (values: UpdateNameSchema) => {
    if (values.name === user?.name) return;

    updateNameMutation.mutate(values.name, {
      onSuccess: () => {
        resetName({
          name: values.name,
        });
      },
    });
  };

  return (
    <div className="w-full space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          My Profile
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Manage your personal information and profile picture.
        </p>
      </div>

      {/* Profile Summary */}
      <Card>
        <CardContent className="flex items-center gap-4 p-4">
          <Avatar className="h-14 w-14 shrink-0">
            <AvatarImage src={user?.profilePicture || undefined} />
            <AvatarFallback>
              {user?.name?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <h2 className="font-semibold">{user?.name}</h2>
            <p className="truncate text-sm text-muted-foreground">
              {user?.email}
            </p>

            <span className="mt-1 inline-block rounded-full bg-pink-100 px-2 py-0.5 text-xs font-medium text-pink-700">
              {user?.role}
            </span>
          </div>

          <div className="ml-0 flex shrink-0 items-center gap-2 border-l pl-4">
            <Coins className="h-5 w-5 text-pink-600" />

            <div>
              <p className="text-xs text-muted-foreground">Points</p>
              <p className="font-bold text-pink-600">{user?.points}</p>
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

        <CardContent className="space-y-6">
          {/* Form Upload Profile Picture */}
          <form onSubmit={handleUploadProfilePicture} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="photo">Profile Picture</Label>
              <Input
                ref={photoInputRef}
                id="photo"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handlePhotoChange}
              />
            </div>

            <Button
              type="submit"
              className="bg-pink-600 hover:bg-pink-700"
              disabled={uploadProfilePictureMutation.isPending || !selectedFile}
            >
              {uploadProfilePictureMutation.isPending
                ? "Uploading..."
                : "Update Picture"}
            </Button>
          </form>

          <Separator />

          {/* Form Update Name */}
          <form
            onSubmit={handleNameSubmit(handleUpdateName)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...registerName("name")} />

              {nameErrors.name && (
                <p className="text-sm text-red-500">
                  {nameErrors.name.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="bg-pink-600 hover:bg-pink-700"
              disabled={updateNameMutation.isPending}
            >
              {updateNameMutation.isPending ? "Saving Name..." : "Save Name"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
