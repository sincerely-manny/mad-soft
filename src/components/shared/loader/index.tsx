import { LucideLoader, LucideLoader2 } from 'lucide-react';

type LoaderProps = {
    size: number;
};

export default function Loader({ size }: LoaderProps) {
    return (
        <div className="animate-spin">
            <LucideLoader2 size={size} />
        </div>
    );
}
