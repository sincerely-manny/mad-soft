import questions from './questions.json';
import type { Question } from './questions.types';

type ReturnedQuestion = Omit<Question, 'correct_answers' | 'correct_answer'>;

export async function getRandomQuestions(count: number = 1): Promise<ReturnedQuestion[]> {
    const res = questions as Question[];

    const shuffledQuestions = res.sort(() => Math.random() - 0.5);
    const ret = shuffledQuestions.slice(0, count).map((question) => {
        let returnedQuestion: ReturnedQuestion;
        if (question.type === 'multiple') {
            const { correct_answers: c, ...rest } = question;
            returnedQuestion = rest as ReturnedQuestion;
        } else {
            const { correct_answer: c, ...rest } = question;
            returnedQuestion = rest as ReturnedQuestion;
        }
        return returnedQuestion;
    });
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(ret);
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
