import z from "zod";

export const sginupResponseSchema = z.object({
  status: z.literal(201),
  body: z
    .object({
      message: z.string().min(5),
      data: z
        .object({
          user: z
            .object({
              id: z.string().uuid(),
              email: z.string().email(),
            })
            .strict(),
          token: z.string().jwt(),
        })
        .strict(),
    })
    .strict(),
});

export type SginupResponseSchema = z.infer<typeof sginupResponseSchema>;
