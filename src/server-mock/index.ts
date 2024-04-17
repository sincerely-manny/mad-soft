import { z } from 'zod';
import questions from './questions.json';
import {
    LongAnswerQuestionSchema,
    MultipleChoiceQuestionSchema,
    ShortAnswerQuestionSchema,
    SingleChoiceQuestionSchema,
    type Question,
} from './questions.types';
import { LocalTest } from '@/types/test';

const ReturnedQuestionSchema = z
    .object({
        uuid: z.string(),
        question: z.string(),
    })
    .and(
        z.union([
            SingleChoiceQuestionSchema.omit({ correct_answer: true }),
            MultipleChoiceQuestionSchema.omit({ correct_answers: true }),
            ShortAnswerQuestionSchema.omit({ correct_answer: true }),
            LongAnswerQuestionSchema.omit({ correct_answer: true }),
        ]),
    );

export type ReturnedQuestion = z.infer<typeof ReturnedQuestionSchema>;

export const QuestoinsSetDTOSchema = z.object({
    questions: z.array(ReturnedQuestionSchema),
    setId: z.string(),
    startTime: z.number(),
    endUntil: z.number(),
});

export type QuestoinsSetDTO = z.infer<typeof QuestoinsSetDTOSchema>;

async function storeQuestionsSetInDb({
    questions: _questions,
    startTime: _startTime,
    endUntil: _endUntil,
}: {
    questions: Question[];
    startTime: number;
    endUntil: number;
}): Promise<string> {
    let randomId = new Array(8)
        .fill(0)
        .map(() => Math.round(Math.random() * 36).toString(36))
        .join('')
        .toUpperCase();
    randomId = `${randomId.substring(0, 4)}-${randomId.substring(4)}`;
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(randomId);
        }, 1000);
    });
}

export async function getRandomQuestions({ count = 15, minutesToComplete = 20 }): Promise<QuestoinsSetDTO> {
    const res = questions as Question[];
    const shuffledQuestions = res.sort(() => Math.random() - 0.5);
    const set = shuffledQuestions.slice(0, count);
    const ret = set.map((question) => {
        let returnedQuestion: ReturnedQuestion;
        if (question.type === 'multiple') {
            const { correct_answers: _c, ...rest } = question;
            returnedQuestion = rest as ReturnedQuestion;
        } else {
            const { correct_answer: _c, ...rest } = question;
            returnedQuestion = rest as ReturnedQuestion;
        }
        return returnedQuestion;
    });
    const startTime = Date.now();
    const endUntil = startTime + 1000 * 60 * minutesToComplete;
    const setId = await storeQuestionsSetInDb({
        questions: set,
        startTime,
        endUntil,
    });
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                questions: ret,
                setId,
                startTime,
                endUntil,
            });
        }, 1000);
    });
}

type SubmitTestResponse = {
    ok: boolean;
    message: string;
};

export async function saveResults(_test: LocalTest): Promise<SubmitTestResponse> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                ok: true,
                message: 'Test submitted successfully',
            });
        }, 1000);
    });
}

export function getCorrectAnswer(uuid: string) {
    const res = questions as Question[];
    const question = res.find((q) => q.uuid === uuid);
    if (!question) {
        return [];
    }
    if (question.type === 'multiple') {
        return question.correct_answers;
    }
    return [question.correct_answer];
}

export async function getCurrentTimestamp(): Promise<number> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(Date.now());
        }, 200);
    });
}
