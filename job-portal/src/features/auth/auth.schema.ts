import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name atleast greater than 2 characters")
    .max(50, "Name must be less than 50 characters"),
  userName: z
    .string()
    .trim()
    .min(3, "Username atleast greater than 3 characters")
    .max(50, "Username must be less than 50 characters")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Username can only contain letters, numbers, underscores, and hyphens",
    ),
  email: z
    .email("Please enter a valid email address")
    .trim()
    .max(255, "Email must not exceed 255 characters")
    .toLowerCase(),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
      "Password must contain atleast one lowercase letter, one uppercase letter and one digit ",
    ),

  role: z
    .enum(["applicant", "employer"], {
      error: "Role must be applicant or employer",
    })
    .default("applicant"),
});

// z.infer automatically creates a TypeScript type from your Zod schema
export type RegisterUserData = z.infer<typeof registerSchema>;

//optional: Create a schema with password confirmation - in server we don't need confPass

export const registerWithConfirmSchema = registerSchema
  .extend({
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password don't match",
    path: ["confirmPassword"],
  });

export type RegisteUserWithConfirmData = z.infer<
  typeof registerWithConfirmSchema
>;



//for login

export const loginSchema = z.object({
  email: z
    .email("Please enter a valid email address")
    .trim()
    .max(255, "Email must not exceed 255 characters")
    .toLowerCase(),

  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export type LoginUserData = z.infer<typeof loginSchema>;
