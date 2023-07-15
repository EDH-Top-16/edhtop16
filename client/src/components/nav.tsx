import Link from "next/link";
import Image from "next/image";

import { EGLogo } from "@/assets/images";
import NavLinks from "@/constants/NavLinks";

// navitem typing
type NavItem = {
  href: string;
  icon: JSX.Element;
};

export default function Navigation(): JSX.Element {
  return (
    <nav className="h-screen w-nav drop-shadow-lg bg-secondary flex flex-col items-center space-y-16">
      <Link className="mt-24" href="/">
        <div className="relative w-24 h-24">
          <Image
            objectFit="cover"
            layout="fill"
            src={EGLogo}
            alt={"eminence gaming logo"}
          />
        </div>
      </Link>

      {NavLinks.map(({ href, icon }) => (
        <NavItem href={href} icon={icon} />
      ))}
    </nav>
  );
}

const NavItem: React.FC<NavItem> = ({ href, icon }) => {
  return (
    <Link className="w-fit [&>svg]:text-white [&>svg]:w-10" href={href}>
      {icon}
    </Link>
  );
};
