import { Link, createFileRoute } from '@tanstack/react-router';
import { ChevronLeft } from 'lucide-react';
import useTest from '@/hooks/test';
import { getCorrectAnswer } from '@/server-mock';

function Results() {
    const { activeTest } = useTest();

    return (
        <section>
            <Link to="/" className="btn">
                <ChevronLeft /> На главную
            </Link>
            <h1 className="my-10 text-4xl font-light">
                Результаты теста <span className="font-mono text-sm">({activeTest?.setId})</span>
            </h1>
            <div>
                {activeTest?.questions.map(({ uuid, question }) => (
                    <div key={uuid} className="mb-10">
                        <h2 className="text-2xl font-light">{question}</h2>
                        <div className="grid grid-cols-2">
                            <div>
                                <h3 className="text-lg font-light">Ваши ответы</h3>
                                {activeTest?.answers[uuid] && (
                                    <ul>{activeTest?.answers[uuid].map((a) => <li key={a}>{a}</li>)}</ul>
                                )}
                            </div>
                            <div>
                                <h3 className="text-lg font-light">Правильные ответы</h3>
                                <ul>
                                    {getCorrectAnswer(uuid).map((a) => (
                                        <li key={a}>{a}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export const Route = createFileRoute('/results')({
    component: Results,
});

export default Route;
