import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import CommanderPage from "./components/CommanderView/CommanderPage";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<App/>}>
              <Route path="commander/*" element={<CommanderPage comander="asdf"/>}/>
            </Route>
        </Routes>
      </BrowserRouter>
  </React.StrictMode>
);
