import { StickyHeader } from "@features/ui/sticky-header";
import classes from "./header.module.css";
import { Group } from "@mantine/core";
import { ColorSchemeToggler } from "@features/ui/color-scheme-toggler";

export function Header() {
    return (
        <StickyHeader className={classes.root}>
            <div className={classes.rightContent}></div>
            <Group>
                <ColorSchemeToggler />
            </Group>
        </StickyHeader>
    )
}