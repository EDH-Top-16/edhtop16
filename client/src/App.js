import Nav from "./components/Nav";
import CommanderView from "./components/CommanderView/CommanderView";
import CommanderPage from "./components/CommanderView/CommanderPage";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

function App() {
  return (
    <div className="bg-bg_primary min-w-screen min-h-screen">
      <Nav />
      <CommanderView />
    </div>
  );
}

export default App;
