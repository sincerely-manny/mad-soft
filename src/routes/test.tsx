import { useMutation } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState, useRef } from 'react';
import { z } from 'zod';
import Countdown from '@/components/page/test/countdown';
import ProgresBar from '@/components/page/test/progressbar';
import { QuestoinsSetDTOSchema, getRandomQuestions } from '@/server-mock';
import TestId from '@/components/page/test/test-id';

const LocalStorageTestSchema = z.intersection(
    QuestoinsSetDTOSchema,
    z.object({
        answers: z.record(z.string().uuid(), z.array(z.string())),
        status: z.enum(['in_progress', 'completed']),
    }),
);

type LocalStorageTest = z.infer<typeof LocalStorageTestSchema>;

function Test() {
    const [activeTest, setActiveTest] = useState<LocalStorageTest | null>(null);
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
                LocalStorageTestSchema.parse(data);
                setActiveTest(data);
            } else {
                throw new Error('no stored test');
            }
        } catch (_err) {
            console.log('no stored test, fetching new one', _err);
            getTestMutation.mutate(
                {
                    count: 15,
                    minutesToComplete: 20,
                },
                {
                    onSuccess: (data) => {
                        console.log('here!');
                        try {
                            const localData = {
                                ...data,
                                answers: {},
                                status: 'in_progress' as const,
                            };
                            LocalStorageTestSchema.parse(localData);
                            setActiveTest(localData);
                            localStorage.setItem('activeTest', JSON.stringify(localData));
                        } catch (err) {
                            console.error(err);
                        }
                    },
                    onError: (err) => {
                        console.error(err);
                    },
                    onSettled: () => {
                        console.log('settled');
                    },
                },
            );
        }
    }, [getTestMutation, testLoaded]);

    return (
        <section className="w-full">
            <div className="my-10 flex items-center justify-between">
                <h1 className="text-6xl font-light">Тестирование</h1>
                <TestId testId={activeTest?.setId} />
                <Countdown endUntil={activeTest?.endUntil ?? 0} startTime={activeTest?.startTime ?? 0} />
            </div>
            <ProgresBar total={15} progress={10} />
        </section>
    );
}

export const Route = createFileRoute('/test')({
    component: Test,
});

export default Route;
