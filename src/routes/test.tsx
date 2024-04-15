import { useMutation } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState, useRef } from 'react';
import Countdown from '@/components/page/test/countdown';
import ProgresBar from '@/components/page/test/progressbar';
import { type QuestoinsSetDTO, QuestoinsSetDTOSchema, getRandomQuestions } from '@/server-mock';
import TestId from '@/components/page/test/test-id';

function Test() {
    const [activeTest, setActiveTest] = useState<QuestoinsSetDTO | null>(null);
    const getTestMutation = useMutation({
        mutationFn: getRandomQuestions,
    });
    const testLoaded = useRef(false);

    useEffect(() => {
        if (testLoaded.current) {
            return;
        }
        testLoaded.current = true;
        try {
            const storedTest = localStorage.getItem('activeTest');
            if (storedTest) {
                const data = JSON.parse(storedTest);
                QuestoinsSetDTOSchema.parse(data);
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
                            QuestoinsSetDTOSchema.parse(data);
                            setActiveTest(data);
                            localStorage.setItem('activeTest', JSON.stringify(data));
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
    }, [getTestMutation]);

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
