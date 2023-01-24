import { BrowserRouter, Routes, Route } from "react-router-dom";

import Nav from "./components/Nav";
import CommanderView from "./components/CommanderView/CommanderView";
import DeckView from "./components/DeckView/DeckView";

/**
 * @TODO make a list of valid URLs so commander/asdf isn't an actual page lol
 */

function App() {
  return (
    <div className="bg-bg_primary min-w-screen min-h-screen">
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route index element={<CommanderView />} />
          <Route path="commander/*" element={<DeckView />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
