import Nav from "./components/Nav";
import CommanderView from "./components/CommanderView/CommanderView";
import CommanderPage from "./components/CommanderView/CommanderPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";

/**
 * @TODO use the path as commander name
 */

function App() {
  return (
    <div className="bg-bg_primary min-w-screen min-h-screen">
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route index element={<CommanderView />} />
          <Route
            path="commander/*"
            element={<CommanderPage commander={"name"} />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
