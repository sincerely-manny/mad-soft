import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';
import Countdown from '@/components/page/test/countdown';
import ProgresBar from '@/components/page/test/progressbar';
import TestId from '@/components/page/test/test-id';
import { type LocalTest } from '@/types/test';
import Question from '@/components/page/test/question';
import Loader from '@/components/shared/loader';
import useTest from '@/hooks/test';
import { saveResults } from '@/server-mock';

function Test() {
    const [showSubmitDialog, setShowSubmitDialog] = useState(false);
    const navigate = useNavigate();
    const { activeTest, setActiveTest, resetTest } = useTest();
    const [init, setInit] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const { question: questionIndex } = Route.useSearch();
    const [activeQuestionIndex, setActiveQuestionIndex] = useState<number | null>(null);

    const setTestCompleted = () => {
        if (activeTest) {
            const a = { ...activeTest, status: 'completed' } as LocalTest;
            setActiveTest(a);
        }
    };

    const submitTestMutation = useMutation({
        mutationFn: async () => {
            if (activeTest) {
                const { ok } = await saveResults(activeTest);
                if (!ok) {
                    throw new Error('Failed to save results');
                }
                return;
            }
            throw new Error('No active test');
        },
        onSuccess: () => {
            navigate({
                to: '/results',
                search: { test: activeTest?.setId ?? '' },
            });
        },
        onError: () => {
            // eslint-disable-next-line no-alert
            alert('Произошла ошибка при завершении теста');
        },
    });

    useEffect(() => {
        if (activeTest?.status === 'in_progress' && !init) {
            setInit(true);
        } else if (activeTest?.status === 'completed' && !init) {
            resetTest();
        } else if (activeTest?.status === 'completed') {
            submitTestMutation.mutate();
        }
    }, [activeTest, init, resetTest, navigate, submitTestMutation]);

    useEffect(() => {
        let q = questionIndex;
        if (activeTest !== null) {
            if (questionIndex === undefined || questionIndex < 0) {
                q = 0;
            } else if (questionIndex >= activeTest.questions.length) {
                q = activeTest.questions.length - 1;
            }
            setActiveQuestionIndex(q ?? 0);
            if (questionIndex !== q) {
                navigate({ search: { question: q } });
            }
            if (q !== activeTest.questions.length - 1) {
                setShowSubmitDialog(false);
            }
        }
    }, [activeTest, questionIndex, navigate]);

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

    const submitTest = () => {
        setTestCompleted();
    };

    return (
        <>
            <section className="mb-10 w-full">
                <div className="my-10 flex items-center justify-between">
                    <h1 className="text-6xl font-light">Тестирование</h1>
                    <TestId testId={activeTest?.setId} />
                    <Countdown
                        endUntil={activeTest?.endUntil ?? 0}
                        startTime={activeTest?.startTime ?? 0}
                        setTestCompleted={setTestCompleted}
                    />
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
                        key={activeQuestion.uuid}
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
                <div className="flex flex-col items-end gap-5">
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
                    {activeTest?.questions.length === (activeQuestionIndex ?? 0) + 1 && !showSubmitDialog && (
                        <button type="button" className="btn btn-warning" onClick={() => setShowSubmitDialog(true)}>
                            Завершить тест <Check />
                        </button>
                    )}
                    {activeTest?.questions.length === (activeQuestionIndex ?? 0) + 1 && showSubmitDialog && (
                        <div className="flex items-center gap-5">
                            <p className="text-sm font-light">
                                Вы уверены, что хотите завершить тест? <br />
                                После завершения теста вы не сможете вернуться к вопросам.
                            </p>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => setShowSubmitDialog(false)}
                            >
                                Отмена
                            </button>
                            <button
                                type="button"
                                className="btn btn-accent"
                                onClick={submitTest}
                                disabled={submitTestMutation.isPending}
                            >
                                Завершить
                            </button>
                        </div>
                    )}
                </div>
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
