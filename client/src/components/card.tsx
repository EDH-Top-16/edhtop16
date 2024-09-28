import cn from "classnames";
import { PropsWithChildren, ReactNode } from "react";

export function Card({
  bottomText,
  images = [],
  hoverEffect = true,
  className,
  children,
}: PropsWithChildren<{
  bottomText?: ReactNode;
  images?: { src: string; alt: string }[];
  hoverEffect?: boolean;
  className?: string;
}>) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-lg bg-white shadow transition-shadow",
        hoverEffect && "cursor-pointer hover:shadow-lg",
        className,
      )}
    >
      <div
        className={cn(
          "absolute left-0 top-0 flex h-full w-full bg-[#312d5a] transition",
          images.length > 0 && "brightness-50",
          hoverEffect &&
            (images.length > 0
              ? "group-hover:brightness-[40%]"
              : "group-hover:brightness-[80%]"),
        )}
      >
        {images.map(({ src, alt }, _i, { length }) => {
          return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className={cn(
                "flex-1 object-cover object-top",
                length === 2 ? "w-1/2" : "w-full",
              )}
              key={src}
              src={src}
              alt={alt}
            />
          );
        })}
      </div>

      <div className="relative px-4 py-5 text-white sm:p-6">{children}</div>

      {bottomText && (
        <div className="absolute bottom-0 w-full bg-black/60 px-2 py-2 text-sm text-white md:text-base">
          {bottomText}
        </div>
      )}
    </div>
  );
}
