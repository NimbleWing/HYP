import {
  MantineProvider
} from "@mantine/core";
import {
  Router
} from "@routes/router";
import "./App.css";
import "@mantine/core/styles.css";
import "@mantine/spotlight/styles.css";
import './global.css';
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
function App() {
  const [isFirstRender, setIsFirstRender] = useState(true);

  useEffect(()=>{
    if (isFirstRender) {
      console.log('首次渲染s');
      setIsFirstRender(false);
    } else {
      console.log('多次渲染s');
    }
    console.log('hi')
    const fetchData = async ()=> {
      console.log("获取数据")
      const a = await invoke('fd', {message: "d:/"});
      console.log(a);
    }
    fetchData();
   
  },[]);

  return (
    <MantineProvider defaultColorScheme="dark">
      <Router />
    </MantineProvider>
  );
}

export default App;
