import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email('Email format invalid'),
  code: z.string().length(6, 'The code must contain 6 numbers'),
});

export type Login = z.infer<typeof LoginSchema>;
