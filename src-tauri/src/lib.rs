mod commands;
use commands::fd_commands;
use tauri::{
    menu::{ Menu, MenuItem },
    tray::{ MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent },
    Manager,
};


#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder
        ::default()
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
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
        .invoke_handler(tauri::generate_handler![
            fd_commands::fd_search,
             ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
