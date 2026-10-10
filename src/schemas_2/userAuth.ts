import { z } from "zod";

// schema register user
export const registerUserSchema = z.object({
  email: z.email(),
  name: z.string().min(2, { error: "Name must be at least 2 characters" }),
  password: z
    .string()
    .min(6, { error: "Password must be at least 6 characters" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^A-Za-z0-9]/, {
      message: "Password must contain at least one special character",
    }),
  role: z.enum(["CUSTOMER", "EVENTORGANIZER"]),
  referralCode: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterUserSchema = z.infer<typeof registerUserSchema>;
