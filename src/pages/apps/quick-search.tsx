
import { Button } from "@mantine/core";
import {
    Spotlight,
    spotlight,
    SpotlightActionData,
} from "@mantine/spotlight";
import { invoke } from "@tauri-apps/api/core";
import { listen, UnlistenFn } from "@tauri-apps/api/event";
import { useEffect, useState } from "react";

function QuickSearch() {
    const [query, setQuery] = useState<string>("");
    const [actions, setActions] = useState<SpotlightActionData[]>([]);
    const [searching, setSearching] = useState(false);
    // 处理实时结果
    useEffect(() => {
        let unlisten: UnlistenFn | undefined;
        const setupListener = async () => {
            // 监听搜索结果事件
            unlisten = await listen<string>("fd-output", (event) => {

                const path = event.payload;
                setActions(prev => {
                    // 去重处理
                    if (!prev.some(a => a.id === path)) {
                        return [...prev, {
                            id: path,
                            label: path,
                            description: `File paths`
                        }];
                    }
                    return prev;
                });
            });
        };

        setupListener();

        return () => {
            if (unlisten) unlisten();
        };
    }, []);

    // 处理搜索请求
    useEffect(() => {
        let isMounted = true;

        const doSearch = async () => {
            if (query.length < 2) return;

            try {
                setSearching(true);
                setActions([]); // 清空旧结果

                // 启动搜索命令（不等待完成）
                await invoke("fd_search", {
                    query: query,
                    path: "d:\\"
                });

            } catch (error) {
                console.error("Search failed:", error);
            } finally {
                if (isMounted) setSearching(false);
            }
        };

        const debounceTimer = setTimeout(doSearch, 300);

        return () => {
            isMounted = false;
            clearTimeout(debounceTimer);
        };
    }, [query]);

    return (
        <>
            <Button
                onClick={spotlight.open}
                loading={searching}
            >
                {searching ? "Searching..." : "Open Search"}
            </Button>

            <Spotlight
                onQueryChange={setQuery}
                actions={actions}
                nothingFound={searching ? "Searchings..." : "No results found"}
                highlightQuery
                scrollable
                filter={(query, actions) => actions} // 禁用内置过滤
                shortcut={null}
            />
        </>
    );
}

export default QuickSearch;