import { ChangeEventHandler } from 'react';
import { type LocalTest } from '@/types/test';

// eslint-disable-next-line react/no-unused-prop-types
type ShortProps = {
    data: LocalTest['questions'][number] & { type: 'short' };
    defaultValue?: string;
    setAnswer: (answer: string[]) => void;
};

export default function Short({ data: { uuid }, defaultValue = '', setAnswer }: ShortProps) {
    const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        const el = e.currentTarget;
        const { value } = el;
        setAnswer([value]);
    };

    return (
        <>
            <p className="font-light italic">(Короткий ответ)</p>
            <form className="mt-4 flex flex-col gap-2">
                <input
                    type="text"
                    name={uuid}
                    className="input input-accent max-w-sm"
                    defaultValue={defaultValue}
                    onChange={handleChange}
                />
            </form>
        </>
    );
}
