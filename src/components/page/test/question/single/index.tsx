import { type LocalTest } from '@/types/test';

// eslint-disable-next-line react/no-unused-prop-types
type SingleProps = {
    data: LocalTest['questions'][number] & { type: 'single' };
};

export default function Single({ data: { question, options } }: SingleProps) {
    return (
        <>
            <p>{question}</p>
            {options.map((option) => (
                <p key={option}>{option}</p>
            ))}
        </>
    );
}
