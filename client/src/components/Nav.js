import { Link } from "react-router-dom";

import { logo, deckIcon, bracketIcon } from "../images/";

export default function Nav() {
  return (
    <div className="fixed flex flex-col items-center justify-start min-h-screen w-1/12 bg-nav drop-shadow-nav z-10">
      <img className="mt-24" src={logo} alt="logo" width="40%" />
      <div className="flex flex-col items-center mt-32 space-y-16 text-white [&>*>*>img]:w-8">
        <span className="">
          <Link to="/">
            <img src={deckIcon} alt="" />
          </Link>
        </span>
        <span>
          <Link to="/">
            <img src={bracketIcon} alt="" />
          </Link>
        </span>
      </div>
    </div>
  );
}
