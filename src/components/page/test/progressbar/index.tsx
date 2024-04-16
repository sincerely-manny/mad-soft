import { useNavigate } from '@tanstack/react-router';
import { LocalTest } from '@/types/test';

type ProgresBarProps = {
    current: number;
    activeTest: LocalTest | null;
};

export default function ProgresBar({ current: progress, activeTest }: ProgresBarProps) {
    const navigate = useNavigate();
    const total = activeTest ? activeTest.questions.length : 0;
    const steps = new Array(total);
    for (let i = 0; i < total; i++) {
        steps[i] = i + 1;
    }
    const isAnswered = (i: number) => {
        if (!activeTest) return false;
        const { uuid } = activeTest.questions[i];
        return activeTest.answers && activeTest.answers[uuid] && activeTest.answers[uuid].length;
    };
    return (
        <ul className="steps w-full">
            {steps.map((e) => (
                <li
                    key={e}
                    className={`
                    step
                    relative
                    ${e < progress && isAnswered(e - 1) ? 'step-neutral' : ''}
                    ${e < progress && !isAnswered(e - 1) ? 'step-primary' : ''}
                    ${e === progress ? ' step-accent' : ''}
                `}
                >
                    <button
                        type="button"
                        className="absolute z-10 aspect-square h-full rounded-full outline outline-0 -outline-offset-4 outline-primary hover:outline-1"
                        onClick={() =>
                            navigate({
                                search: {
                                    question: e - 1,
                                },
                            })
                        }
                    >
                        <span className="sr-only">Перейти к вопросу №{e}</span>
                    </button>
                </li>
            ))}
        </ul>
    );
}
