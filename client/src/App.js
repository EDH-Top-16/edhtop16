import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import Nav from "./components/Nav";
import CommanderView from "./components/CommanderView/CommanderView";
import DeckView from "./components/DeckView/DeckView";
import TournamentView from "./components/TournamentView/TournamentView";
import APIDocs from "./components/APIDocs/APIDocs";
import NotFound from "./components/404";

/**
 * @TODO make a list of valid URLs so commander/asdf isn't an actual page lol
 */

function App() {
  const [commander, setCommander] = useState("");
  const [commanderExist, setCommanderExist] = useState(true);

  // useEffect to get commanders
  useEffect(() => {
    axios
      .post(process.env.REACT_APP_uri + "/api/req", { commander: commander })
      .then((res) => {
        // console.log(commander, res.data);
        if (res.data.length > 0) {
          setCommanderExist(true);
        } else {
          setCommanderExist(false);
        }
      });
  }, [commander]);

  return (
    <div className="bg-bg_primary min-w-screen min-h-screen">
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route index element={<CommanderView />} />
          <Route
            path="commander/*"
            element={
              commanderExist ? (
                <DeckView setCommander={setCommander} />
              ) : (
                <NotFound />
              )
            }
          />
          <Route path="api" element={<APIDocs />} />
          <Route path="tournament" element={<TournamentView />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
