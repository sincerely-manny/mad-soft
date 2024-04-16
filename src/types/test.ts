import { z } from 'zod';
import { QuestoinsSetDTOSchema } from '@/server-mock';

export const LocalTestSchema = z.intersection(
    QuestoinsSetDTOSchema,
    z.object({
        answers: z.record(z.string().uuid(), z.array(z.string())),
        status: z.enum(['in_progress', 'completed']),
    }),
);

export type LocalTest = z.infer<typeof LocalTestSchema>;
