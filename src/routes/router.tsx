import { createBrowserRouter, RouterProvider } from "react-router";
import { paths } from "./paths";
import { DashboardLayout } from "layouts/dashboard";
import { Navigate } from "react-router";
import { LazyPage } from './lazy-page';

const router = createBrowserRouter([

    {
        path: '/',
        element: <Navigate to={paths.dashboard.root} replace />,
    },
    {
        path: paths.dashboard.root,
        element: (
            <DashboardLayout />
        ),
        children: [
            {
                index: true,
                path: paths.dashboard.root,
                element: <Navigate to={paths.dashboard.home} replace />,
            },
            {
                path: paths.dashboard.home,
                element: LazyPage(() => import("@pages/dashboard/home"))
            }
        ]
    }
]);
export function Router() {
    return <RouterProvider router={router} />;
}