// import { Button } from "@mantine/core";
// import {
//     Spotlight,
//     spotlight,
//     SpotlightActionData,
// } from "@mantine/spotlight";
// import { invoke } from "@tauri-apps/api/core";
// import { listen } from "@tauri-apps/api/event";
// import { useEffect, useState } from "react";
// function QuickSearch() {
//     const [query, setQuery] = useState<string>("");
//     const [actions, setActions] = useState<SpotlightActionData[]>([
//     ]);
//     const [queryFinished, setQueryFinished] = useState<boolean>(true);
//     listen("fd-output", (event)=> {
//         console.log(event);
//     })
//     useEffect(() => {
//         const fetchData = async () => {
//             setQueryFinished(false);
//             // const result: string = await invoke("fd", { message: query });
//             const result: string = await invoke("fd_search", { query: query , path: "d:/"});
//             let a: SpotlightActionData[] = [];
//             result.split("\n\n").map((path, index) => {
//                 if (path.length > 0) {
//                     a.push({
//                         id: path,
//                         description: `${index}-${result.split("\n\n").length}`,
//                         label: path,
//                     })
//                 }

//             })

//             setActions(a);
//             setQueryFinished(true);
//         }
//         if (query.length >= 2 && queryFinished) {
//             fetchData();
//         }

//     }, [query]);
//     return (
//         <>
//             <Button onClick={spotlight.open}>open</Button>
//             <Spotlight
//                 onQueryChange={(value) => {
//                     setQuery(value);
//                 }}
//                 scrollable
//                 actions={actions}
//                 nothingFound="Nothing"
//                 highlightQuery

//             ></Spotlight>
//         </>
//     )
// }

// export default QuickSearch;
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
                            description: `File path`
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
                    path: "d:/"
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
                nothingFound={searching ? "Searching..." : "No results found"}
                highlightQuery
                scrollable
                limit={50}
                filter={(query, actions) => actions} // 禁用内置过滤
                shortcut={null}
            />
        </>
    );
}

export default QuickSearch;