
import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters"),
});

export type CreateCategoryFormSchema = z.infer<
  typeof createCategorySchema
>;

export const editCategorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters"),
});

export type EditCategoryFormSchema = z.infer<typeof editCategorySchema>;
