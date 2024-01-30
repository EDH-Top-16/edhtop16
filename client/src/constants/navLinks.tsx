import AboutIcon from "../assets/icons/AboutIcon";
import BracketIcon from "../assets/icons/BracketIcon";
import DeckIcon from "../assets/icons/DeckIcon";

interface NavLink {
  href: string;
  label: string;
  icon: JSX.Element;
}

export const NavLinks: NavLink[] = [
  { href: "/commanders", label: "commanders", icon: <DeckIcon /> },
  { href: "/tournaments", label: "tournaments", icon: <BracketIcon /> },
  { href: "/about", label: "about", icon: <AboutIcon /> },
];
