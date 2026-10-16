import { z } from 'zod';
import { APPLY } from '@/content/content';
import { digitsOnly } from '@/lib/phone';

/** Правила проверки — раздел 8.1 ТЗ. */
export const createLeadSchema = (
  errors: Record<keyof typeof APPLY.form.errors, string>,
) =>
  z.object({
    name: z.string().trim().min(2, errors.name),
    phone: z
      .string()
      .refine((value) => digitsOnly(value).length >= 9, errors.phone),
    city: z.string().trim().min(2, errors.city),
    format: z.enum(['center', 'b2g', 'unknown']),
    consent: z
      .boolean()
      .refine((value) => value === true, { message: errors.consent }),
    /** Ловушка для ботов: должна остаться пустой. */
    company: z.string().max(0).optional(),
  });

export const leadSchema = createLeadSchema(APPLY.form.errors);

export type LeadValues = z.infer<typeof leadSchema>;
