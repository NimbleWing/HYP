import { useEffect, useState } from "react";
import { invoke, isTauri } from "@tauri-apps/api/core";
import { isEnabled } from "@tauri-apps/plugin-autostart";
import {
  MantineProvider
} from "@mantine/core";
import "./App.css";
import "@mantine/core/styles.css";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");
  const [launchAtLogin, setLaunchAtLogin] = useState(true);

  useEffect(() => {
    const fetchAutoStartStatus = async () => {
      if (isTauri()) {
        try {
          const status = await isEnabled();
          setLaunchAtLogin(status);
        } catch (error) {
          console.error("Failed to fetch autostart status:", error);
        }
      }
    }
    fetchAutoStartStatus();
  }, []);
  const enableAutoStart = async () => {
    if (isTauri()) {
      try {
        invoke("change_autostart", { open: true });
      } catch (error) {
        console.error("Failed to enable autostart:", error);
      }
    }
    setLaunchAtLogin(true);
  };

  const disableAutoStart = async () => {
    if (isTauri()) {
      try {
        console.log(isTauri, "disableAutoStart")
        invoke("change_autostart", { open: false });
      } catch (error) {
        console.error("Failed to disable autostart:", error);
      }
    }
    setLaunchAtLogin(false);
  };
  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    setGreetMsg(await invoke("greet", { name }));
  }

  return (
    <MantineProvider>


      <main className="container">


        <button
          onClick={() => {
            !launchAtLogin ? enableAutoStart() : disableAutoStart()
          }}
        >{launchAtLogin + ""}</button>
        <form
          className="row"
          onSubmit={(e) => {
            e.preventDefault();
            greet();
          }}
        >
          <input
            id="greet-input"
            onChange={(e) => setName(e.currentTarget.value)}
            placeholder="Enter a name..."
          />
          <button type="submit">Greet</button>
        </form>
        <p>{greetMsg}</p>
      </main>
    </MantineProvider>
  );
}

export default App;
