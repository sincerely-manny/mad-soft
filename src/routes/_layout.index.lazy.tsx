import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/_layout/')({
    component: () => <div>Hello /!</div>,
});

export default Route;
