import { z } from 'zod';

export const timeTravelSchema = z
  .object({
    advanceHours: z.coerce.number().min(0.01).max(720),
  })
  .strip();

export default {
  timeTravelSchema,
};
