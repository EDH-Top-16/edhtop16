import { AboutIcon, BracketIcon, DeckIcon } from "../assets/icons";

type NavLink = {
  href: string;
  label: string;
  icon: JSX.Element;
};

export const NavLinks: NavLink[] = [
  { href: "/commanders", label: "commanders", icon: <DeckIcon /> },
  { href: "/tournaments", label: "tournaments", icon: <BracketIcon /> },
  { href: "/about", label: "about", icon: <AboutIcon /> },
];
