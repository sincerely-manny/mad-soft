import { ClipboardCopy } from 'lucide-react';
import { MouseEventHandler, useState } from 'react';
import Loader from '@/components/shared/loader';

type TestIdProps = {
    testId?: string | null;
};

export default function TestId({ testId = null }: TestIdProps) {
    const [tooltipOpen, setTooltipOpen] = useState(false);
    const handleTestIdClick: MouseEventHandler<HTMLButtonElement> = (e) => {
        const content = e.currentTarget.innerText;

        try {
            navigator.clipboard.writeText(content).then(() => {
                setTooltipOpen(true);
                setTimeout(() => {
                    setTooltipOpen(false);
                }, 2000);
            });
        } catch (err) {
            console.error(err);
        }
    };
    if (testId === null) {
        return <Loader size={24} />;
    }
    return (
        <div className="flex items-center gap-1">
            <span>ID теста:</span>
            <button
                type="button"
                className="tooltip-open font-mono underline decoration-dashed data-[tooltip-active=true]:tooltip"
                data-tip="Скопировано!"
                data-tooltip-active={tooltipOpen}
                onClick={handleTestIdClick}
            >
                {testId}
            </button>
            <ClipboardCopy size={16} />
        </div>
    );
}
