import { Outlet } from "react-router";
import {
    Paper,
    ScrollArea,
} from "@mantine/core";


import { Logo } from "@features/ui/logo";
import { Sidebar } from "../sidebar";
import { Header } from "../header";
import classes from "./root.module.css";

export function DashboardLayout() {
    return (
        <div className={classes.root}>
            <Paper className={classes.sidebarWrapper} withBorder>
                <div className={classes.logoWrapper}>
                    <Logo w="3rem" />
                </div>
                <ScrollArea flex="1" px="md" >
                    <Sidebar />
                </ScrollArea>
            </Paper>
            <div className={classes.content}>
                <Header />
                <main className={classes.main}>
                    <Outlet />
                </main>
            </div>
        </div>
    )
}