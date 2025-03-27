mod autostart;
use std::time::Instant;
use tauri::{
    menu::{ Menu, MenuItem },
    tray::{ MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent },
    Manager,
    Emitter
};
use autostart::{ change_autostart, enable_autostart };
use tauri_plugin_autostart::MacosLauncher;
use tauri_plugin_shell::ShellExt;
// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
async fn fd_search(
    app: tauri::AppHandle,
    query: String,
    path: String,
) -> Result<(), String> {
    use tauri::{Manager};
    use tauri_plugin_shell::process::CommandEvent;
    // 创建命令并启动
    let (mut rx, _child) = app.shell()
        .sidecar("fd")
        .map_err(|e| format!("创建命令失败: {}", e))?
        .args([&query, "--color=never", &path])
        .spawn()
        .map_err(|e| format!("启动失败: {}", e))?;

    let app_emit = app.clone();

    // 启动异步任务处理事件流
    tauri::async_runtime::spawn(async move {
        let mut buffer = String::new();

        while let Some(event) = rx.recv().await {
            match event {
                // 处理标准输出
                CommandEvent::Stdout(chunk) => {
                    let text = String::from_utf8_lossy(&chunk); 
                    buffer.push_str(&text);

                    // 按行分割处理
                    while let Some(pos) = buffer.find('\n') {
                        let (line_part, rest) = buffer.split_at(pos + 1);
                        let clean_line = line_part.trim_end_matches(|c| c == '\n' || c == '\r');
                        
                        app_emit.emit("fd-output", clean_line.to_string())
                            .unwrap_or_else(|e| eprintln!("发送失败: {}", e));
                        
                        buffer = rest.to_string();
                    }
                }

                // 处理标准错误
                CommandEvent::Stderr(err) => {
                    app_emit.emit("fd-error", err)
                        .unwrap_or_else(|e| eprintln!("错误发送失败: {}", e));
                }

                // 处理进程终止
                CommandEvent::Terminated(exit_status) => {
                    // let status_msg = if exit_status.success() {
                    //     "complete:success"
                    // } else {
                    //     format!("complete:error:{}", exit_status.code().unwrap_or(-1))
                    // };
                    
                    app_emit.emit("fd-complete", "ss")
                        .unwrap_or_else(|e| eprintln!("完成事件发送失败: {}", e));
                    
                    break;
                }
                _ => {}
            }
        }

        // 处理剩余的缓冲区数据
        if !buffer.is_empty() {
            app_emit.emit("fd-output", buffer.trim())
                .unwrap_or_else(|e| eprintln!("尾部数据发送失败: {}", e));
        }
    });

    Ok(())
}

#[tauri::command]
async fn fd(app: tauri::AppHandle, message: String) -> String {
    println!("调用fd, {}", message);

    // 测量调用开始到创建命令的时间
    let start = Instant::now();
    let sidecar_command = app.shell().sidecar("fd").unwrap().arg(message).arg("d:/");
    let create_command_duration = start.elapsed();
    println!("创建命令耗时: {:?}", create_command_duration);

    println!("----");

    // 测量执行命令的时间
    let start = Instant::now();
    let output = sidecar_command.output().await.unwrap();
    let execute_command_duration = start.elapsed();
    println!("执行命令耗时: {:?}", execute_command_duration);

    println!("bbbb");

    // 测量处理输出的时间
    let start = Instant::now();
    let response = String::from_utf8(output.stdout).unwrap();
    let process_output_duration = start.elapsed();
    println!("处理输出耗时: {:?}", process_output_duration);

    println!("返回");

    // 总耗时
    let total_duration = create_command_duration + execute_command_duration + process_output_duration;
    println!("总耗时: {:?}", total_duration);

    response
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder
        ::default()
        .plugin(tauri_plugin_autostart::init(MacosLauncher::AppleScript, None))
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
            enable_autostart(app);
            let quit_i = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;
            let menu = Menu::with_items(app, &[&quit_i])?;

            let _tray = TrayIconBuilder::new()
                .on_tray_icon_event(|tray, event| {
                    match event {
                        TrayIconEvent::Click {
                            button: MouseButton::Left,
                            button_state: MouseButtonState::Up,
                            ..
                        } => {
                            let app = tray.app_handle();
                            if let Some(window) = app.get_webview_window("main") {
                                let _ = window.show();
                                let _ = window.set_focus();
                            }
                        }
                        _ => {
                            println!("unhandled event {event:?}");
                        }
                    }
                })
                .on_menu_event(|app, event| {
                    match event.id.as_ref() {
                        "quit" => {
                            app.exit(0);
                        }
                        _ => {
                            println!("menu item {:?} not handled", event.id);
                        }
                    }
                })
                .menu(&menu)
                .show_menu_on_left_click(false)
                .icon(app.default_window_icon().unwrap().clone())
                .build(app)?;

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![fd_search, change_autostart,fd])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
