import {
  MantineProvider
} from "@mantine/core";
import {
  Router
} from "@routes/router";
import "./App.css";
import "@mantine/core/styles.css";
import './global.css';
function App() {


  return (
    <MantineProvider defaultColorScheme="dark">
      <Router />
    </MantineProvider>
  );
}

export default App;
