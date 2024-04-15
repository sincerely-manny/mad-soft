import { z } from 'zod';

export const SingleChoiceQuestionSchema = z.object({
    type: z.literal('single'),
    options: z.array(z.string()),
    correct_answer: z.string(),
});

export type SingleChoiceQuestion = z.infer<typeof SingleChoiceQuestionSchema>;

export const MultipleChoiceQuestionSchema = z.object({
    type: z.literal('multiple'),
    options: z.array(z.string()),
    correct_answers: z.array(z.string()),
});

export type MultipleChoiceQuestion = z.infer<typeof MultipleChoiceQuestionSchema>;

export const ShortAnswerQuestionSchema = z.object({
    type: z.literal('short'),
    correct_answer: z.string(),
});

export type ShortAnswerQuestion = z.infer<typeof ShortAnswerQuestionSchema>;

export const LongAnswerQuestionSchema = z.object({
    type: z.literal('long'),
    correct_answer: z.string(),
});

export type LongAnswerQuestion = z.infer<typeof LongAnswerQuestionSchema>;

export const QuestionSchema = z
    .object({
        uuid: z.string(),
        question: z.string(),
    })
    .and(
        z.union([
            SingleChoiceQuestionSchema,
            MultipleChoiceQuestionSchema,
            ShortAnswerQuestionSchema,
            LongAnswerQuestionSchema,
        ]),
    );

export type Question = z.infer<typeof QuestionSchema>;
