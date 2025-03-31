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
            },
            {
                path: paths.dashboard.apps.root,
                children: [
                    {
                        index: true,
                        path: paths.dashboard.apps.root,
                        element: <Navigate to={paths.dashboard.apps.quickSearch} replace/>,
                    },
                    {
                        path: paths.dashboard.apps.quickSearch,
                        element: LazyPage(()=> import("@pages/apps/quick-search"))
                    }
                ]
            }
        ]
    },
    {
        path: paths.dashboard.apps.root,
        children: [
            {
                index: true,
                path: paths.dashboard.apps.root,
                element: <Navigate to={paths.dashboard.apps.root} replace />,
            }
        ]
    }
]);
export function Router() {
    return <RouterProvider router={router} />;
}