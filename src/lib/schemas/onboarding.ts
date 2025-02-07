import { z } from 'zod'

export const onboardingSchema = z.object({
  firstName: z
    .string()
    .min(1, 'Please provide First Name')
    .max(50, 'First name cannot exceed 50 characters'),
  lastName: z
    .string()
    .min(1, 'Please provide Last Name')
    .max(50, 'Last name cannot exceed 50 characters'),
  phoneNumber: z
    .string()
    .regex(
      /^\+1[0-9]{10}$/,
      'Must be a valid Canadian phone number starting with +1'
    ),
  corporationNumber: z
    .string()
    .regex(/^[0-9]{9}$/, 'Corporation number must be exactly 9 digits'),
})

export type OnboardingFormData = z.infer<typeof onboardingSchema>
