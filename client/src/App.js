import { BrowserRouter, Routes, Route } from "react-router-dom";

import Nav from "./components/Nav";
import CommanderView from "./components/CommanderView/CommanderView";
import DeckView from "./components/DeckView/DeckView";
import TournamentView from "./components/TournamentView/TournamentView";
import APIDocs from "./components/APIDocs/APIDocs";

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
          <Route path="api" element={<APIDocs />} />
          <Route path="tournament" element={<TournamentView />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
