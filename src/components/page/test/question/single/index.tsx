import { ChangeEventHandler } from 'react';
import { type LocalTest } from '@/types/test';

// eslint-disable-next-line react/no-unused-prop-types
type SingleProps = {
    data: LocalTest['questions'][number] & { type: 'single' };
    defaultChecked?: string;
    setAnswer: (answer: string[]) => void;
};

export default function Single({ data: { options, uuid }, defaultChecked = undefined, setAnswer }: SingleProps) {
    const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        const el = e.currentTarget;
        if (el.checked) {
            setAnswer([el.value]);
        }
    };

    return (
        <>
            <p className="font-light italic">(Выберите один вариант)</p>
            <form className="mt-4 flex flex-col gap-2">
                {options.map((option) => (
                    <label key={option} htmlFor={uuid + option} className="flex cursor-pointer items-center gap-2">
                        <input
                            type="radio"
                            name="uuid"
                            className="radio-accent radio"
                            id={uuid + option}
                            value={option}
                            onChange={handleChange}
                            defaultChecked={defaultChecked === option}
                        />
                        <span>{option}</span>
                    </label>
                ))}
            </form>
        </>
    );
}
