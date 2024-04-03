import Image from "next/image";
import Link from "next/link";
import AboutIcon from "../assets/icons/AboutIcon";
import BracketIcon from "../assets/icons/BracketIcon";
import DeckIcon from "../assets/icons/DeckIcon";
import { TopDeckLogo } from "../assets/images";

interface NavLink {
  href: string;
  label: string;
  icon: JSX.Element;
}

const NAV_LINKS: NavLink[] = [
  { href: "/commanders", label: "commanders", icon: <DeckIcon /> },
  { href: "/tournaments", label: "tournaments", icon: <BracketIcon /> },
  { href: "/about", label: "about", icon: <AboutIcon /> },
];

export function Navigation(): JSX.Element {
  return (
    <nav className="fixed left-[-400px] flex h-screen w-nav flex-col items-center space-y-16 bg-purple-400 md:relative md:left-0">
      <Link className="mt-24" href="/">
        <div className="relative h-12 w-12">
          <Image
            fill
            style={{ objectFit: "cover" }}
            src={TopDeckLogo}
            alt={"topdeck logo"}
          />
        </div>
      </Link>

      {NAV_LINKS.map((props: NavLink, i: number) => (
        <NavItem key={i} {...props} />
      ))}
    </nav>
  );
}

const NavItem: React.FC<NavLink> = ({ href, label, icon }) => {
  return (
    <Link href={href} legacyBehavior passHref={true}>
      <a className="w-fit [&>svg]:w-8 [&>svg]:text-white" aria-label={label}>
        {icon}
      </a>
    </Link>
  );
};
