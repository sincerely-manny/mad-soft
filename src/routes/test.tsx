import { useMutation } from '@tanstack/react-query';
import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import Countdown from '@/components/page/test/countdown';
import ProgresBar from '@/components/page/test/progressbar';
import { getRandomQuestions } from '@/server-mock';
import TestId from '@/components/page/test/test-id';
import { type LocalTest, LocalTestSchema } from '@/types/test';
import Question from '@/components/page/test/question';
import Loader from '@/components/shared/loader';

function Test() {
    const navigate = useNavigate();
    const [activeTest, setActiveTest] = useState<LocalTest | null>(null);
    const [testLoaded, setTestLoaded] = useState(false);
    const getTestMutation = useMutation({
        mutationFn: getRandomQuestions,
    });

    useEffect(() => {
        if (testLoaded) {
            return;
        }
        setTestLoaded(true);
        try {
            const storedTest = localStorage.getItem('activeTest');
            if (storedTest) {
                const data = JSON.parse(storedTest);
                LocalTestSchema.parse(data);
                setActiveTest(data);
            } else {
                throw new Error('no stored test');
            }
        } catch (_err) {
            getTestMutation.mutate(
                {
                    count: 15,
                    minutesToComplete: 20,
                },
                {
                    onSuccess: (data) => {
                        try {
                            const localData = {
                                ...data,
                                answers: {},
                                status: 'in_progress' as const,
                            };
                            LocalTestSchema.parse(localData);
                            setActiveTest(localData);
                            localStorage.setItem('activeTest', JSON.stringify(localData));
                        } catch (err) {
                            console.error(err);
                        }
                    },
                    onError: (err) => {
                        console.error(err);
                    },
                },
            );
        }
    }, [getTestMutation, testLoaded]);

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const { question: questionNumber } = Route.useSearch();

    const [activeQuestionNumber, setActiveQuestionNumber] = useState<number | null>(null);

    useEffect(() => {
        let q = questionNumber;
        if (activeTest !== null) {
            if (questionNumber === undefined || questionNumber < 0) {
                q = 0;
            } else if (questionNumber >= activeTest.questions.length) {
                q = activeTest.questions.length - 1;
            }
            setActiveQuestionNumber(q ?? 0);
            if (questionNumber !== q) {
                navigate({ search: { question: q } });
            }
        }
    }, [activeTest, questionNumber, navigate]);

    return (
        <>
            <section className="mb-10 w-full">
                <div className="my-10 flex items-center justify-between">
                    <h1 className="text-6xl font-light">Тестирование</h1>
                    <TestId testId={activeTest?.setId} />
                    <Countdown endUntil={activeTest?.endUntil ?? 0} startTime={activeTest?.startTime ?? 0} />
                </div>
                <ProgresBar total={activeTest?.questions.length ?? 0} progress={(activeQuestionNumber ?? 0) + 1} />
            </section>
            <section className="flex w-full justify-between">
                <button
                    type="button"
                    onClick={() =>
                        navigate({
                            search: { question: (activeQuestionNumber ?? 0) - 1 },
                        })
                    }
                    className="btn"
                    disabled={!activeQuestionNumber}
                >
                    <ChevronLeft />
                    Предыдущий вопрос
                </button>
                <button
                    type="button"
                    onClick={() =>
                        navigate({
                            search: { question: (activeQuestionNumber ?? 0) + 1 },
                        })
                    }
                    className="btn btn-accent"
                    disabled={activeTest?.questions.length === (activeQuestionNumber ?? 0) + 1}
                >
                    Следующий вопрос
                    <ChevronRight />
                </button>
            </section>

            {activeTest === null || activeQuestionNumber === null ? (
                <div className="flex place-self-center opacity-50">
                    <Loader size={128} />
                </div>
            ) : (
                <section>
                    <Question data={activeTest?.questions[activeQuestionNumber]} />
                </section>
            )}
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
