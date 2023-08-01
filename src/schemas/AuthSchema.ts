import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email('Email format invalid'),
  code: z.string().length(6, 'The code must contain 6 numbers'),
});

export const TokenPayloadSchema = z.object({
  sub: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  imageURL: z.string(),
  roles: z.object({
    admin: z.boolean(),
    seller: z.boolean(),
  }),
});

export type Login = z.infer<typeof LoginSchema>;
export type TokenPayload = z.infer<typeof TokenPayloadSchema> | null;
