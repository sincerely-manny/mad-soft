import { useNavigate } from '@tanstack/react-router';

type ProgresBarProps = {
    progress: number;
    total: number;
};

export default function ProgresBar({ progress, total }: ProgresBarProps) {
    const navigate = useNavigate();
    const steps = new Array(total);
    for (let i = 0; i < total; i++) {
        steps[i] = i + 1;
    }
    return (
        <div className="steps w-full">
            {steps.map((e) => (
                <button
                    type="button"
                    key={e}
                    className={`
                        step
                        ${e < progress ? 'step-neutral' : ''}
                        ${e === progress ? ' step-accent' : ''}
                    `}
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
            ))}
        </div>
    );
}
