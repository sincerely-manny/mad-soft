import { ChangeEventHandler } from 'react';
import { type LocalTest } from '@/types/test';

// eslint-disable-next-line react/no-unused-prop-types
type LongProps = {
    data: LocalTest['questions'][number] & { type: 'long' };
    defaultValue?: string;
    setAnswer: (answer: string[]) => void;
};

export default function Long({ data: { uuid }, defaultValue = '', setAnswer }: LongProps) {
    const handleChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
        const el = e.currentTarget;
        const { value } = el;
        setAnswer([value]);
    };

    return (
        <>
            <p className="font-light italic">(Развернутый ответ)</p>
            <form className="mt-4 flex flex-col gap-2">
                <textarea
                    className="textarea textarea-bordered textarea-accent min-h-64 max-w-5xl"
                    name={uuid}
                    defaultValue={defaultValue}
                    onChange={handleChange}
                />
            </form>
        </>
    );
}
