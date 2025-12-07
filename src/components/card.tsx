import cn from 'classnames';
import {PropsWithChildren, ReactNode} from 'react';

function TwoImageCrossfade({
  images,
}: {
  images: [{src: string; alt: string}, {src: string; alt: string}];
}) {
  return (
    <>
      <img
        className="absolute inset-0 h-full w-full object-cover object-top"
        src={images[0].src}
        alt={images[0].alt}
        style={{
          maskImage: 'linear-gradient(to right, black 40%, transparent 60%)',
          WebkitMaskImage:
            'linear-gradient(to right, black 40%, transparent 60%)',
        }}
      />
      <img
        className="absolute inset-0 h-full w-full object-cover object-top"
        src={images[1].src}
        alt={images[1].alt}
        style={{
          maskImage: 'linear-gradient(to left, black 40%, transparent 60%)',
          WebkitMaskImage:
            'linear-gradient(to left, black 40%, transparent 60%)',
        }}
      />
    </>
  );
}

export function Card({
  bottomText,
  images = [],
  hoverEffect = true,
  className,
  children,
}: PropsWithChildren<{
  bottomText?: ReactNode;
  images?: {src: string; alt: string}[];
  hoverEffect?: boolean;
  className?: string;
}>) {
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow',
        hoverEffect && 'cursor-pointer hover:shadow-lg',
        className,
      )}
    >
      <div
        className={cn(
          'absolute top-0 left-0 flex h-full w-full bg-[#312d5a] transition',
          images.length > 0 && 'brightness-40',
          hoverEffect &&
            (images.length > 0
              ? 'group-hover:brightness-40'
              : 'group-hover:brightness-80'),
        )}
      >
        {images.length === 2 ? (
          <TwoImageCrossfade
            images={
              images as [{src: string; alt: string}, {src: string; alt: string}]
            }
          />
        ) : (
          images.map(({src, alt}) => (
            <img
              className="w-full flex-1 object-cover object-top"
              key={src}
              src={src}
              alt={alt}
            />
          ))
        )}
      </div>

      <div className="relative p-4 text-white sm:p-6 h-full">{children}</div>

      {bottomText && (
        <div className="absolute bottom-0 w-full bg-black/60 px-2 py-2 text-sm text-white md:text-base">
          {bottomText}
        </div>
      )}
    </div>
  );
}
