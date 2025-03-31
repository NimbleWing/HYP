use tauri_plugin_shell::{ process::CommandEvent, ShellExt };
use tauri::Emitter;

#[tauri::command]
pub async fn fd_search(app: tauri::AppHandle, query: String, path: String) -> Result<(), String> {
    let (mut rx, _child) = app
        .shell()
        .sidecar("fd")
        .map_err(|e| format!("创建命令失败: {}", e))?
        .args(["-t", "f", &query, &path])
        .spawn()
        .map_err(|e| format!("启动失败: {}", e))?;

    let app_emit = app.clone();

    tauri::async_runtime::spawn(async move {
        let mut buffer = String::new();
        while let Some(event) = rx.recv().await {
            match event {
                CommandEvent::Stdout(chunk) => {
                    let text = String::from_utf8_lossy(&chunk);
                    buffer.push_str(&text);
                    // 处理 Windows 换行符 \r\n
                    while let Some(pos) = buffer.find("\n") {
                        let line = buffer.drain(..=pos).collect::<String>();
                        let clean_line = line.trim_end_matches(|c| (c == '\r' || c == '\n'));
                        app_emit
                            .emit("fd-output", clean_line)
                            .unwrap_or_else(|e| eprintln!("发送失败: {}", e));
                    }

                    // 处理可能的残留 \n
                    if let Some(pos) = buffer.find('\n') {
                        let line = buffer.drain(..=pos).collect::<String>();
                        let clean_line = line.trim_end_matches('\n');
                        app_emit
                            .emit("fd-output", clean_line)
                            .unwrap_or_else(|e| eprintln!("发送失败: {}", e));
                    }
                }
                // 处理标准错误
                CommandEvent::Stderr(err) => {
                    let err_msg = String::from_utf8_lossy(&err);

                    app_emit
                        .emit("fd-error", err_msg.to_string())
                        .unwrap_or_else(|e| eprintln!("错误发送失败: {}", e));
                }
                // 处理进程终止
                CommandEvent::Terminated(exit_status) => {
                    // 处理剩余数据
                    if !buffer.is_empty() {
                        let clean_line = buffer.trim_end_matches(|c| (c == '\r' || c == '\n'));
                        app_emit
                            .emit("fd-output", clean_line)
                            .unwrap_or_else(|e| eprintln!("尾部数据发送失败: {}", e));
                        buffer.clear();
                    }

                    app_emit
                        .emit("fd-complete", exit_status.code)
                        .unwrap_or_else(|e| eprintln!("完成事件发送失败: {}", e));
                }
                _ => {}
            }
        }
    });
    Ok(())
}
