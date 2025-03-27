use ignore::Walk;
#[tauri::command]
pub fn find(query: String) -> String {
    
}

pub struct File {
    pub name: String,
}