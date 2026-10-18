import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useCreateCategory from "@/hooks/API/category/useCreateCategory";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCategories } from "@/hooks/API/category/useGetCategories";
import { useForm } from "react-hook-form";
import type { Category } from "@/types/category.type";
import {
  createCategorySchema,
  type CreateCategoryFormSchema,
  editCategorySchema,
  type EditCategoryFormSchema,
} from "@/schemas_2/category";
import { zodResolver } from "@hookform/resolvers/zod";
import useEditCategory from "@/hooks/API/category/useEditCategory";
import useDeleteCategory from "@/hooks/API/category/useDeleteCategory";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const CategoryPage = () => {
  // Feature Get
  const { data, isPending, isError } = useCategories();

  const createCategory = useCreateCategory();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateCategoryFormSchema>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: "",
    },
  });

  const [open, setOpen] = useState(false);

  const onSubmit = (values: CreateCategoryFormSchema) => {
    createCategory.mutate(values, {
      onSuccess: () => {
        reset();
        setOpen(false);
      },
    });
  };

  // Feature Edit
  const editCategory = useEditCategory();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [editOpen, setEditOpen] = useState(false);

  const {
    register: registerEdit,
    handleSubmit: handleEditSubmit,
    reset: resetEdit,
    formState: { errors: editErrors },
  } = useForm<EditCategoryFormSchema>({
    resolver: zodResolver(editCategorySchema),
    defaultValues: {
      name: "",
    },
  });

  const onEditSubmit = (values: EditCategoryFormSchema) => {
    if (!selectedCategory) return;

    editCategory.mutate(
      {
        id: selectedCategory.id,
        name: values.name,
      },
      {
        onSuccess: () => {
          resetEdit();
          setEditOpen(false);
          setSelectedCategory(null);
        },
      },
    );
  };

  // Feature delete
  const deleteCategory = useDeleteCategory();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedDeleteCategory, setSelectedDeleteCategory] =
    useState<Category | null>(null);

  const onDelete = () => {
    if (!selectedDeleteCategory) return;

    deleteCategory.mutate(selectedDeleteCategory.id, {
      onSuccess: () => {
        setDeleteOpen(false);
        setSelectedDeleteCategory(null);
      },
    });
  };

  if (isPending) {
    return <div className="p-6">Loading categories...</div>;
  }

  if (isError) {
    return (
      <div className="p-6 text-red-500">
        Failed to load categories. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Categories</h1>
          <p className="text-sm text-muted-foreground">
            Manage and view event categories.
          </p>
        </div>

        {/* Dialog menambahkan category */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger>
            <Button>Add Category</Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Category</DialogTitle>
              <DialogDescription>
                Enter a name for the new event category.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category-name">Category Name</Label>
                <Input
                  id="category-name"
                  placeholder="e.g. Music"
                  {...register("name")}
                  disabled={createCategory.isPending}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={createCategory.isPending}
                >
                  Cancel
                </Button>

                <Button type="submit" disabled={createCategory.isPending}>
                  {createCategory.isPending ? "Creating..." : "Create Category"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Dialog edit category */}
        <Dialog
          open={editOpen}
          onOpenChange={(isOpen) => {
            // ketika request berjalan tidak bisa ditutup dialognya
            if (editCategory.isPending) return;

            setEditOpen(isOpen);

            // untuk reset isi form setelah ditutup
            if (!isOpen) {
              resetEdit();
              setSelectedCategory(null);
            }
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
              <DialogDescription>
                Update the name of this event category.
              </DialogDescription>
            </DialogHeader>

            {/* Form Edit*/}
            <form
              onSubmit={handleEditSubmit(onEditSubmit)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="edit-category-name">Category Name</Label>
                <Input
                  id="edit-category-name"
                  {...registerEdit("name")}
                  disabled={editCategory.isPending}
                />
                {editErrors.name && (
                  <p className="text-sm text-red-500">
                    {editErrors.name.message}
                  </p>
                )}
              </div>

              {/* Button cancel and save */}
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditOpen(false)}
                  disabled={editCategory.isPending}
                >
                  Cancel
                </Button>

                <Button type="submit" disabled={editCategory.isPending}>
                  {editCategory.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Confirmation Dialog Delete category */}
        <AlertDialog
          open={deleteOpen}
          onOpenChange={(isOpen) => {
            if (deleteCategory.isPending) return;

            setDeleteOpen(isOpen);

            if (!isOpen) {
              setSelectedDeleteCategory(null);
            }
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Category?</AlertDialogTitle>

              <AlertDialogDescription>
                Are you sure you want to delete the category{" "}
                <span className="font-semibold text-foreground">
                  {selectedDeleteCategory?.name}
                </span>
                ? This action cannot be undone. Categories that are still used
                by events cannot be deleted.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleteCategory.isPending}>
                Cancel
              </AlertDialogCancel>

              <AlertDialogAction
                onClick={(event) => {
                  event.preventDefault();
                  onDelete();
                }}
                disabled={deleteCategory.isPending}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleteCategory.isPending ? "Deleting..." : "Delete Category"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Category Name</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data && data.length > 0 ? (
              data.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.id}</TableCell>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>
                    {new Date(category.createdAt).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedCategory(category);
                          resetEdit({ name: category.name });
                          setEditOpen(true);
                        }}
                      >
                        Edit
                      </Button>

                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setSelectedDeleteCategory(category);
                          setDeleteOpen(true);
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-24 text-center text-muted-foreground"
                >
                  No categories found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
