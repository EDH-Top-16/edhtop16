import Link from "next/link";
import Image from "next/image";

import { EGLogo } from "@/assets/images";
import NavLinks from "@/constants/NavLinks";

// navitem typing
type NavItem = {
  href: string;
  label: string;
  icon: JSX.Element;
};

export default function Navigation(): JSX.Element {
  return (
    <nav className="flex h-screen w-nav flex-col items-center space-y-16 bg-secondary drop-shadow-lg">
      <Link className="mt-24" href="/">
        <div className="relative h-24 w-24">
          <Image
            objectFit="cover"
            layout="fill"
            src={EGLogo}
            alt={"eminence gaming logo"}
          />
        </div>
      </Link>

      {NavLinks.map((props) => (
        <NavItem {...props} />
      ))}
    </nav>
  );
}

const NavItem: React.FC<NavItem> = ({ href, label, icon }) => {
  return (
    <Link href={href} legacyBehavior passHref={true}>
      <a className="w-fit [&>svg]:w-10 [&>svg]:text-white" aria-label={label}>
        {icon}
      </a>
    </Link>
  );
};
