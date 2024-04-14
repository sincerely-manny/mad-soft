import { Outlet, createFileRoute } from '@tanstack/react-router';

function LayoutComponent() {
    return (
        <div>
            <h1>Layout</h1>
            <Outlet />
        </div>
    );
}
export const Route = createFileRoute('/_layout')({
    component: LayoutComponent,
});

export default Route;
