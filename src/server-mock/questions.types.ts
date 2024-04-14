type SingleChoiceQuestion = {
    type: 'single';
    options: string[];
    correct_answer: string;
};

type MultipleChoiceQuestion = {
    type: 'multiple';
    options: { title: string; correct?: boolean }[];
    correct_answers: string[];
};

type ShortAnswerQuestion = {
    type: 'short';
    correct_answer: string;
};

type LongAnswerQuestion = {
    type: 'long';
    correct_answer: string;
};

export type Question = {
    uuid: string;
    question: string;
} & (SingleChoiceQuestion | MultipleChoiceQuestion | ShortAnswerQuestion | LongAnswerQuestion);
