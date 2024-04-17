import { useQuery } from '@tanstack/react-query';
import { CSSProperties, useEffect, useState } from 'react';
import { getCurrentTimestamp } from '@/server-mock';
import Loader from '@/components/shared/loader';

type CountdownProps = {
    startTime: number;
    endUntil: number;
    setTestCompleted: () => void;
};

export default function Countdown({ startTime, endUntil, setTestCompleted }: CountdownProps) {
    const [clientTime, setClientTime] = useState(Date.now());
    const serverTime = useQuery({
        queryKey: ['currentTime'],
        queryFn: getCurrentTimestamp,
        refetchInterval: 1000 * 10,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        staleTime: 0,
    });

    useEffect(() => {
        if (serverTime.data) {
            setClientTime(serverTime.data);
        }
    }, [serverTime.data]);

    useEffect(() => {
        const interval = setInterval(() => {
            setClientTime((prev) => prev + 1000);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const timeLeft = (endUntil - (clientTime ?? 0)) / 1000;
    let progress = Math.ceil(((timeLeft * 1000) / (endUntil - startTime)) * 100 * 10) / 10;
    const isTimeLeft = timeLeft > 0;
    let minutesLeft = Math.floor(timeLeft / 60);
    let secondsLeft = Math.floor(timeLeft % 60);

    if (startTime === 0 || endUntil === 0) {
        return <Loader size={80} />;
    }

    if (!isTimeLeft) {
        progress = 100;
        minutesLeft = 0;
        secondsLeft = 0;
        setTestCompleted();
    }

    return (
        <div
            className="radial-progress text-primary-content/70"
            style={
                {
                    '--value': progress,
                    '--thickness': '0.25rem',
                    color: `hsl(349, ${(100 - progress) / 2}%, 63%)`,
                } as CSSProperties
            }
            role="progressbar"
        >
            <span className="countdown font-mono text-xl">
                <span style={{ '--value': minutesLeft } as CSSProperties} />:
                <span style={{ '--value': secondsLeft } as CSSProperties} />
            </span>
            <div>
                <span className="sr-only">70% Complete</span>
            </div>
        </div>
    );
}
