type ProgresBarProps = {
    progress: number;
    total: number;
};

export default function ProgresBar({ progress, total }: ProgresBarProps) {
    const steps = new Array(total);
    for (let i = 0; i < total; i++) {
        steps[i] = i + 1;
    }
    return (
        <ul className="steps w-full">
            {steps.map((e) => (
                <li
                    key={e}
                    className={`
                        step
                        ${e < progress ? 'step-neutral' : ''}
                        ${e === progress ? ' step-accent' : ''}
                    `}
                />
            ))}
        </ul>
    );
}
