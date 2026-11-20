import { z } from 'zod';

export const initiateClaimSchema = z
  .object({
    day: z.coerce.number().int().min(1).max(7).optional(),
  })
  .strip();

export const confirmClaimSchema = z
  .object({
    claimId: z.string().min(1, 'Claim ID is required'),
  })
  .strip();

export const historyQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(20),
  })
  .strip();

export default {
  initiateClaimSchema,
  confirmClaimSchema,
  historyQuerySchema,
};
