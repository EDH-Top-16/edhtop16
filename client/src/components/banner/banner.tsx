import Image from "next/image";
import { PropsWithChildren } from "react";
import { BannerMask } from "../../assets/images";

interface BannerProps {
  title: string;
}

export function Banner({
  title,
  children,
}: PropsWithChildren<BannerProps>): JSX.Element {
  return (
    <div className="relative h-fit w-full bg-primary p-6">
      <span className="relative z-10 flex flex-col space-y-4">
        <h1 className="text-tertiary">{title}</h1>
        {children}
      </span>
      <Image
        className="absolute right-0 top-0 z-0 float-right h-full w-full md:w-1/2"
        style={{ objectFit: "cover", objectPosition: "left" }}
        src={BannerMask}
        alt="eminence gaming logo"
      />
    </div>
  );
}
