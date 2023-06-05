import { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import NavContext from "../contexts/NavContext";

import { logo, deckIcon, bracketIcon } from "../images/";
import BracketIcon from "../images/BracketIcon";
import DeckIcon from "../images/DeckIcon";
import AboutIcon from "../images/AboutIcon";
import EminenceIcon from "../images/EminenceIcon";
import ThemeSwitcher from "./ThemeSwitcher/ThemeSwitcher";

export default function Nav() {
  const {open, toggle, setOpen} = useContext(NavContext)
  const navRef = useRef(null)

  useEffect(() => {
    const handleClick = (e) => {
      // console.log(navRef.current, "click")
      if(navRef.current && !navRef.current.contains(e.target))
        setOpen(false)
    }

    window.addEventListener('mousedown', handleClick);
  
    return () => {
      window.removeEventListener('mousedown', handleClick);
    }
  }, [])

  


  return (
    <div className={`fixed ${open ? "w-[200px] " : 'w-0'} md:static flex flex-col items-center justify-start min-h-screen md:w-1/12 md:hover:w-2/12 overflow-hidden bg-white dark:bg-nav drop-shadow-nav z-[100] transition-all duration-200 group`} ref={navRef}>
      <img className="mt-24" src={logo} alt="logo" width="40%" />
      <div className={`${open ? "block opacity-1" : "opacity-0 hidden md:group-hover:block md:group-hover:opacity-100"} mt-6`}>
        <ThemeSwitcher />
      </div>
      <div className="flex flex-col md:items-center md:group-hover:items-start mt-12 space-y-16 text-voilet dark:text-white [&>*>*>img]:w-8">
        <span className="flex flex-col gap-4">
          <Link to="/" className="flex flex-row items-center gap-2 [&_path]:fill-voilet [&_path]:dark:fill-white">
            <DeckIcon />
            <span className="md:hidden md:group-hover:block">Decks</span>
          </Link>
        </span>
        <span>
          <Link to="/tournaments" className="flex flex-row items-center gap-2 [&_path]:fill-voilet [&_path]:dark:fill-white">
            <BracketIcon  />
            <span className="md:hidden md:group-hover:block">Tournaments</span>
          </Link>
        </span>
        <span>
          <Link to="/about" className="flex flex-row items-center gap-2 [&_path]:fill-voilet [&_path]:dark:fill-white">
            <AboutIcon  />
            <span className="md:hidden md:group-hover:block">About</span>
          </Link>
        </span>
        <span>
          <a href="https://eminence.events/" target="_blank" className="flex flex-row items-center gap-2 [&_path]:fill-voilet [&_path]:dark:fill-white">
            <EminenceIcon  />
            <span className="md:hidden md:group-hover:block">Eminence</span>
          </a>
        </span>
      </div>
    </div>
  );
}
