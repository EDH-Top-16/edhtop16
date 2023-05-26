import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import Nav from "./components/Nav";
import CommanderView from "./components/CommanderView/CommanderView";
import DeckView from "./components/DeckView/DeckView";
import TournamentView from "./components/TournamentView/TournamentView";
import SingleTournamentView from "./components/TournamentView/SingleTournamentView";
import About from "./components/About/About";
import APIDocs from "./components/APIDocs/APIDocs";
import NotFound from "./components/404";
import LoadingPage from "./components/LoadingPage";
import { NavContextProvider } from "./contexts/NavContext";
import { ThemeContextProvider } from "./contexts/ThemeContext";
import ReactGA from 'react-ga4';

/**
 * @TODO make a list of valid URLs so commander/asdf isn't an actual page lol
 */

const THEMES = ["dark", "light"];
const TRACKING_ID = "G-56527VG23P";

function App() {
  ReactGA.initialize(TRACKING_ID);

  const [commander, setCommander] = useState("");
  const [commanderExist, setCommanderExist] = useState(true);

  const [theme, setTheme] = useState("dark");

  const updateTheme = (newVal = null) => {
    setTheme((currentVal) => {
      const calculatedTheme = newVal || THEMES[Number(currentVal === "dark")];

      localStorage.setItem("theme", calculatedTheme);

      if (calculatedTheme === "dark")
        document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");

      return calculatedTheme;
    });
  };

  useEffect(() => {
    updateTheme(localStorage.theme || "dark");
  }, []);

  const [navOpen, setNavOpen] = useState(false);

  return (
    <div
      className={`${theme} bg-white dark:bg-voilet min-w-screen min-h-screen flex flex-row`}
    >
      <NavContextProvider value={{open: navOpen, toggle: () => setNavOpen(o => !o), setOpen: setNavOpen}}>
      <ThemeContextProvider value={{theme: theme, toggle: () => updateTheme(), setTheme: updateTheme}}>
        <BrowserRouter>
          <Nav />
          <Routes>
            <Route index element={<CommanderView />} />
            <Route
              path="commander/*"
              element={
                !commanderExist ? (
                  <NotFound />
                ) : (
                  <DeckView
                    setCommander={setCommander}
                    setCommanderExist={setCommanderExist}
                  />
                )
              }
            />
            <Route path="api" element={<APIDocs />} />
            <Route path="tournaments" element={<TournamentView />} />
            <Route path="tournament/:TID" element={<SingleTournamentView/>}/>
            <Route path="about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ThemeContextProvider>
      </NavContextProvider>
    </div>
  );
}

export default App;