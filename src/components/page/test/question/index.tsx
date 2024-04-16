import { LocalTest } from '@/types/test';
import Single from './single';
import Multiple from './multiple';
import Short from './short';
import Long from './long';

type QuestionProps = {
    questionData: LocalTest['questions'][number];
    answer: LocalTest['answers'][number] | undefined;
    setAnswer: (answer: string[]) => void;
};

export default function Question({ questionData, answer, setAnswer }: QuestionProps) {
    const { type, question } = questionData;

    return (
        <>
            <h3 className="text-3xl">{question}</h3>
            {type === 'single' && (
                <Single data={questionData} defaultChecked={answer ? answer[0] : undefined} setAnswer={setAnswer} />
            )}
            {type === 'multiple' && (
                <Multiple data={questionData} defaultChecked={answer || []} setAnswer={setAnswer} />
            )}
            {type === 'short' && (
                <Short data={questionData} defaultValue={answer ? answer[0] : ''} setAnswer={setAnswer} />
            )}
            {type === 'long' && (
                <Long data={questionData} defaultValue={answer ? answer[0] : ''} setAnswer={setAnswer} />
            )}
        </>
    );
}
