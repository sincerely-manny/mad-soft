import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { LocalTest, LocalTestSchema } from '@/types/test';
import { getRandomQuestions } from '@/server-mock';

const useTest = () => {
    const [activeTest, setActiveTest] = useState<LocalTest | null>(null);
    const [testLoaded, setTestLoaded] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const getTestMutation = useMutation({
        mutationFn: getRandomQuestions,
    });

    // load test from local storage or get a new one from a server
    useEffect(() => {
        if (testLoaded) {
            return;
        }
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
                        } catch (err) {
                            setError((err as Error).message);
                        }
                    },
                    onError: (err) => {
                        setError((err as Error).message);
                    },
                },
            );
        }
        setTestLoaded(true);
    }, [getTestMutation, testLoaded]);

    // store test in local storage whenever it changes
    useEffect(() => {
        if (!testLoaded) {
            return;
        }
        localStorage.setItem('activeTest', JSON.stringify(activeTest));
    }, [activeTest, testLoaded]);

    const resetTest = () => {
        setTestLoaded(false);
        localStorage.removeItem('activeTest');
        setActiveTest(null);
    };

    return {
        activeTest,
        setActiveTest,
        error,
        resetTest,
    };
};

export default useTest;
