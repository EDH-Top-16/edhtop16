import Link from "next/link";

import { EminenceIcon } from "@/app/assets/icons";
import NavLinks from "@/constants/NavLinks";

// navitem typing
type NavItem = {
  href: string;
  icon: JSX.Element;
};

export default function Navigation() {
  return (
    <nav className="h-screen w-nav bg-secondary flex flex-col space-x-4">
      <Link href="/">
        <EminenceIcon></EminenceIcon>
      </Link>

      {NavLinks.map(({ href, icon }) => (
        <NavItem href={href} icon={icon} />
      ))}
    </nav>
  );
}

const NavItem: React.FC<NavItem> = ({ href, icon }) => {
  return <Link href={href}>{icon}</Link>;
};
