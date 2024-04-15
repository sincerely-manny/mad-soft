import { useQuery } from '@tanstack/react-query';
import { CSSProperties, useEffect, useState } from 'react';
import { getCurrentTimestamp } from '@/server-mock';

type CountdownProps = {
    startTime: number;
    endUntil: number;
};

export default function Countdown({ startTime, endUntil }: CountdownProps) {
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
    const progress = Math.ceil(((timeLeft * 1000) / (endUntil - startTime)) * 100);
    // const isTimeLeft = timeLeft > 0;
    const minutesLeft = Math.floor(timeLeft / 60);
    const secondsLeft = Math.floor(timeLeft % 60);

    if (startTime === 0 || endUntil === 0) {
        return null;
    }

    return (
        <div
            className="radial-progress text-neutral opacity-70"
            style={{ '--value': progress } as CSSProperties}
            role="progressbar"
        >
            <span className="countdown font-mono text-lg">
                <span style={{ '--value': minutesLeft } as CSSProperties} />:
                <span style={{ '--value': secondsLeft } as CSSProperties} />
            </span>
            <div>
                <span className="sr-only">70% Complete</span>
            </div>
        </div>
    );
}
