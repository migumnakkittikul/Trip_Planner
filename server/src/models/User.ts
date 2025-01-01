import { z } from 'zod';

export const UserSchema = z.object({
    user_id: z.number().optional(),
    user_name: z.string(),
    phone: z.number().optional(),
    email: z.string().email()
});

export type User = z.infer<typeof UserSchema>;