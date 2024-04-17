import { ChangeEventHandler, useEffect, useState } from 'react';
import { type LocalTest } from '@/types/test';

// eslint-disable-next-line react/no-unused-prop-types
type MultipleProps = {
    data: LocalTest['questions'][number] & { type: 'multiple' };
    defaultChecked?: string[];
    setAnswer: (answer: string[]) => void;
};

export default function Multiple({ data: { options, uuid }, defaultChecked = undefined, setAnswer }: MultipleProps) {
    const [checked, setChecked] = useState(defaultChecked);
    const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        const el = e.currentTarget;
        const { value } = el;
        let a = [...(checked || [])];
        if (el.checked && !a.includes(value)) {
            a.push(value);
        } else {
            a = a.filter((o) => o !== value);
        }
        setChecked(a);
    };

    useEffect(() => {
        setAnswer(checked || []);
    }, [checked, setAnswer]);

    return (
        <>
            <p className="font-light italic">(Выберите один или несколько вариантов)</p>
            <form className="mt-4 flex flex-col gap-2">
                {options.map((option) => (
                    <label key={option} htmlFor={uuid + option} className="flex cursor-pointer items-center gap-2">
                        <input
                            type="checkbox"
                            name="uuid"
                            className="radio-accent radio"
                            id={uuid + option}
                            value={option}
                            onChange={handleChange}
                            defaultChecked={defaultChecked?.includes(option)}
                        />
                        <span>{option}</span>
                    </label>
                ))}
            </form>
        </>
    );
}
