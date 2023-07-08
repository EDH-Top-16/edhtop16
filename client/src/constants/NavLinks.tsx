import { AboutIcon, BracketIcon, DeckIcon } from "@/app/assets/icons";

// navlink typing
type NavLink = {
  href: string;
  icon: JSX.Element;
};

const NavLinks: NavLink[] = [
  { href: "/commanders", icon: <DeckIcon /> },
  { href: "/tournaments", icon: <BracketIcon /> },
  { href: "/about", icon: <AboutIcon /> },
];

export default NavLinks;
