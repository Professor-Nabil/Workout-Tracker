import z from "zod";

export const userSchema = z
  .object({
    email: z.email(),
    password: z.string().min(8),
  })
  .strict();

export type UserSchema = z.infer<typeof userSchema>;

export const responseSignupSchema = z.object({
  message: z.string().min(1),
  data: z.object({
    user: z.object({
      id: z.uuid(),
      email: z.email(),
    }),
    token: z.jwt(),
  }),
});

export type ResponseSignupSchema = z.infer<typeof responseSignupSchema>;
