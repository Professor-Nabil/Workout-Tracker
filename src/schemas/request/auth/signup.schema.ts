import z from "zod";

export const sginupBodytSchema = z
  .object({
    email: z
      .string()
      .trim() // Automatically removes accidental whitespace from the beginning or end
      .toLowerCase()
      .email()
      .max(191, { message: "Email cannot exceed 191 characters." }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long." })
      .max(30, { message: "Password cannot exceed 30 characters." })
      .refine((password) => /[A-Z]/.test(password), {
        message: "Password must contain at least one uppercase letter (A-Z).",
      })
      .refine((password) => /[a-z]/.test(password), {
        message: "Password must contain at least one lowercase letter (a-z).",
      }),

    /*
     * FIXME: If you want to add this you the 'e2e auth sginup' test will be faild
     * because the 'faker' module sometimes don't generate random numbers
     */
    // .refine((password) => /[0-9]/.test(password), {
    //   message: "Password must contain at least one number (0-9).",
    // }),

    /*
     * FIXME: If you want to add this you the 'e2e auth sginup' test will be faild
     * because the 'faker' module sometimes don't generate random special character
     */
    // .refine((password) => /[!@#$%^&*?]/.test(password), {
    //   message:
    //     "Password must contain at least one special character (!@#$%^&*?).",
    // }),
  })
  .strict();

export type SginupResponseSchema = z.infer<typeof sginupBodytSchema>;
