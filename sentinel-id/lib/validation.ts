import { z } from 'zod';

export const signInSchema = z.object({
  email: z.string().trim().email('Enter a valid email address.').max(254),
  password: z.string().min(8, 'Password must be at least 8 characters.').max(128),
});

export const profileSchema = z.object({
  fullName: z.string().trim().min(1, 'Full name is required.').max(100),
  jobTitle: z.string().trim().max(100),
  department: z.string().trim().max(100),
});
