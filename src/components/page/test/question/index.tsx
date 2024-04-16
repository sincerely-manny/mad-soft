import { LocalTest } from '@/types/test';
import Single from './single';

type QuestionProps = {
    data: LocalTest['questions'][number];
};

export default function Question({ data }: QuestionProps) {
    const { type } = data;

    if (type === 'single') {
        return <Single data={data} />;
    }

    return (
        <>
            <p>type: {type}</p>
            <p>q: {data.question}</p>
        </>
    );
}
