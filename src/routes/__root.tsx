import { createRootRoute, Outlet } from '@tanstack/react-router';
// import { TanStackRouterDevtools } from '@tanstack/router-devtools';

export const Route = createRootRoute({
    component: () => (
        <>
            <main className="container mx-auto flex min-h-screen flex-col items-start p-5">
                <Outlet />
            </main>
            {/* <TanStackRouterDevtools /> */}
        </>
    ),
});

export default Route;
