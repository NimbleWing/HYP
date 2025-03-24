import { ComponentType, ElementType, lazy, Suspense } from "react";
const Loadable = (Component: ElementType) => (props: any) => (
    <Suspense>
        <Component {...props} />
    </Suspense>
)
export function LazyPage(callback: () => Promise<{ default: ComponentType<any> }>) {
    const Component = Loadable(lazy(callback));
    return <Component />;
}