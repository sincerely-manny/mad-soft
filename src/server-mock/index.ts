import { z } from 'zod';
import questions from './questions.json';
import {
    LongAnswerQuestionSchema,
    MultipleChoiceQuestionSchema,
    ShortAnswerQuestionSchema,
    SingleChoiceQuestionSchema,
    type Question,
} from './questions.types';

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

export async function checkAnswer(questionUUID: Question['uuid'], answer: string | string[]): Promise<boolean> {
    const res = questions as Question[];
    const question = res.find((q) => q.uuid === questionUUID);
    let isCorrect = false;
    if (!question) {
        throw new Error('Question not found');
    }
    if (question.type === 'multiple') {
        isCorrect = question.correct_answers.every((a) => answer.includes(a));
    } else {
        isCorrect = question.correct_answer === answer;
    }
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(isCorrect);
        }, 1000);
    });
}

export async function getCurrentTimestamp(): Promise<number> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(Date.now());
        }, 200);
    });
}
