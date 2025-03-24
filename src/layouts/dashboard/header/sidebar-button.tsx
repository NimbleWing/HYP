import { Drawer } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect } from "react";
import { useLocation } from "react-router";
import { Sidebar } from "../sidebar";
import { HamburgerButton } from "@features/ui/hamburger-button";

export function SidebarButton() {
    const location = useLocation();
    const [opened, { open, close }] = useDisclosure(false);
    useEffect(() => {
        close();
    }, [location.pathname]);

    return (
        <>
            <Drawer.Root opened={opened} onClose={close} size="270px">
                <Drawer.Overlay />
                <Drawer.Content>
                    <Drawer.Header px="1.725rem" mb="md">
                        test
                    </Drawer.Header>
                    <Drawer.Body>
                        <Sidebar />
                    </Drawer.Body>
                </Drawer.Content>
            </Drawer.Root>
            <HamburgerButton onClick={open} display={{ xl: "none" }} />
        </>
    )
}