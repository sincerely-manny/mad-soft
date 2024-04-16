import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import Countdown from '@/components/page/test/countdown';
import ProgresBar from '@/components/page/test/progressbar';
import TestId from '@/components/page/test/test-id';
import { type LocalTest } from '@/types/test';
import Question from '@/components/page/test/question';
import Loader from '@/components/shared/loader';
import useTest from '@/hooks/test';

function Test() {
    const navigate = useNavigate();

    const { activeTest, setActiveTest } = useTest();

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const { question: questionNumber } = Route.useSearch();

    const [activeQuestionIndex, setActiveQuestionIndex] = useState<number | null>(null);

    useEffect(() => {
        let q = questionNumber;
        if (activeTest !== null) {
            if (questionNumber === undefined || questionNumber < 0) {
                q = 0;
            } else if (questionNumber >= activeTest.questions.length) {
                q = activeTest.questions.length - 1;
            }
            setActiveQuestionIndex(q ?? 0);
            if (questionNumber !== q) {
                navigate({ search: { question: q } });
            }
        }
    }, [activeTest, questionNumber, navigate]);

    const setAnswer = (questionUUID: string) => (answer: string[]) => {
        if (activeTest) {
            const a = { ...activeTest };
            a.answers[questionUUID] = answer;
            setActiveTest(a);
        }
    };

    let activeQuestion: LocalTest['questions'][number] | null = null;
    if (activeTest !== null && activeQuestionIndex !== null) {
        activeQuestion = activeTest?.questions[activeQuestionIndex];
    }

    return (
        <>
            <section className="mb-10 w-full">
                <div className="my-10 flex items-center justify-between">
                    <h1 className="text-6xl font-light">Тестирование</h1>
                    <TestId testId={activeTest?.setId} />
                    <Countdown endUntil={activeTest?.endUntil ?? 0} startTime={activeTest?.startTime ?? 0} />
                </div>
                <ProgresBar current={(activeQuestionIndex ?? 0) + 1} activeTest={activeTest || null} />
            </section>

            {activeQuestion === null ? (
                <div className="flex place-self-center opacity-50">
                    <Loader size={128} />
                </div>
            ) : (
                <section>
                    <Question
                        questionData={activeQuestion}
                        answer={activeTest?.answers[activeQuestion.uuid]}
                        setAnswer={setAnswer(activeQuestion.uuid)}
                    />
                </section>
            )}

            <section className="mt-10 flex w-full justify-between">
                <button
                    type="button"
                    onClick={() =>
                        navigate({
                            search: { question: (activeQuestionIndex ?? 0) - 1 },
                        })
                    }
                    className="btn"
                    disabled={!activeQuestionIndex}
                >
                    <ChevronLeft />
                    Предыдущий вопрос
                </button>
                <button
                    type="button"
                    onClick={() =>
                        navigate({
                            search: { question: (activeQuestionIndex ?? 0) + 1 },
                        })
                    }
                    className="btn btn-accent"
                    disabled={activeTest?.questions.length === (activeQuestionIndex ?? 0) + 1}
                >
                    Следующий вопрос
                    <ChevronRight />
                </button>
            </section>
        </>
    );
}

const TestQueryParamatersSchema = z.object({
    question: z.number().optional().catch(undefined),
});

type TestQueryParamaters = z.infer<typeof TestQueryParamatersSchema>;

export const Route = createFileRoute('/test')({
    component: Test,
    validateSearch: (q: Record<string, unknown>): TestQueryParamaters => TestQueryParamatersSchema.parse(q),
});

export default Route;
