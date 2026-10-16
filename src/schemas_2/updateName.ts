import { z } from "zod";

export const updateNameSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters"),
});

export type UpdateNameSchema = z.infer<typeof updateNameSchema>;