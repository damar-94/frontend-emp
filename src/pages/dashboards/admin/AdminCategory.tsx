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
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useCreateCategory from "@/hooks/API/category/useCreateCategory";
import useDeleteCategory from "@/hooks/API/category/useDeleteCategory";
import useEditCategory from "@/hooks/API/category/useEditCategory";
import { useCategories } from "@/hooks/API/category/useGetCategories";
import {
  createCategorySchema,
  editCategorySchema,
  type CreateCategoryFormSchema,
  type EditCategoryFormSchema,
} from "@/schemas_2/category";
import type { Category } from "@/types/category.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

export const AdminCategory = () => {
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
    <div className="space-y-6">
      {/* Page Header */}

      {/* Page Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Categories
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage event categories available on the platform.
          </p>
        </div>

        {/* Dialog Add Category */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger>
            <Button className="shrink-0 bg-pink-600 text-white hover:bg-pink-700">
              Add Category
            </Button>
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
      </div>

      {/* Category Card */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Category Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="h-12 px-6 font-semibold text-gray-600">
                  Category Name
                </TableHead>

                <TableHead className="h-12 px-6 font-semibold text-gray-600">
                  Created At
                </TableHead>

                <TableHead className="h-12 px-6 text-right font-semibold text-gray-600">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {data && data.length > 0 ? (
                data.map((category) => (
                  <TableRow
                    key={category.id}
                    className="transition-colors hover:bg-gray-50"
                  >
                    <TableCell className="px-6 py-4 font-medium text-gray-900">
                      {category.name}
                    </TableCell>

                    <TableCell className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {new Date(category.createdAt).toLocaleDateString(
                        "id-ID",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        },
                      )}
                    </TableCell>

                    <TableCell className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        {/* Dialog Edit Category */}
                        <Dialog
                          open={editOpen}
                          onOpenChange={(isOpen) => {
                            if (editCategory.isPending) return;

                            setEditOpen(isOpen);

                            if (!isOpen) {
                              resetEdit();
                              setSelectedCategory(null);
                            }
                          }}
                        >
                          <DialogTrigger>
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
                          </DialogTrigger>

                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Category</DialogTitle>
                              <DialogDescription>
                                Update the name of this event category.
                              </DialogDescription>
                            </DialogHeader>

                            <form
                              onSubmit={handleEditSubmit(onEditSubmit)}
                              className="space-y-4"
                            >
                              <div className="space-y-2">
                                <Label htmlFor="edit-category-name">
                                  Category Name
                                </Label>

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

                              <div className="flex justify-end gap-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => setEditOpen(false)}
                                  disabled={editCategory.isPending}
                                >
                                  Cancel
                                </Button>

                                <Button
                                  type="submit"
                                  disabled={editCategory.isPending}
                                >
                                  {editCategory.isPending
                                    ? "Saving..."
                                    : "Save Changes"}
                                </Button>
                              </div>
                            </form>
                          </DialogContent>
                        </Dialog>

                        {/* Delete Category */}
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
                    colSpan={3}
                    className="h-28 text-center text-sm text-gray-500"
                  >
                    No categories found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Confirmation Dialog Delete Category */}
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
              ? This action cannot be undone. Categories that are still used by
              events cannot be deleted.
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
  );
};
