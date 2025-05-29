import { graphql, useFragment } from "react-relay/hooks";
import { promo_EmbededPromo$key } from "../queries/__generated__/promo_EmbededPromo.graphql";

export function FirstPartyPromo(props: { promo: promo_EmbededPromo$key }) {
  const promo = useFragment(
    graphql`
      fragment promo_EmbededPromo on FirstPartyPromo {
        title
        description
        buttonText
        backgroundImageUrl
        imageUrl
        href
      }
    `,
    props.promo,
  );

  return (
    <div className="relative mx-auto my-4 w-full max-w-screen-lg overflow-hidden rounded-none bg-cover bg-center md:w-4/5 md:rounded-md lg:w-3/4">
      <div className="absolute left-0 top-0 flex h-full w-full brightness-[40%]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt="promo"
          className={"w-full flex-1 object-cover object-center"}
          src={promo.backgroundImageUrl}
        />
      </div>

      <div className="absolute inset-0 bg-black/40"></div>
      <a
        href={promo.href}
        target="_blank"
        rel="noopener"
        className="relative z-10 block px-4 py-3 md:p-6"
      >
        <div className="group mx-auto flex max-w-screen-lg">
          <div className="flex-1">
            <h2 className="mb-1 text-lg font-bold text-white md:mb-2 md:text-xl lg:text-2xl">
              {promo.title}
            </h2>

            <p className="mb-2 text-xs text-white/90 md:mb-3 md:text-sm lg:text-base">
              {promo.description.map((text, i) => {
                return (
                  <span key={i} className="block">
                    {text}
                  </span>
                );
              })}
            </p>

            <div className="inline-block rounded-md bg-amber-500 px-3 py-1.5 text-sm font-semibold text-black transition-colors group-hover:bg-amber-600 md:px-4 md:py-2 md:text-base">
              {promo.buttonText}
            </div>
          </div>

          {promo.imageUrl && (
            <div
              className="h-min-content flex-1 -rotate-12 bg-contain bg-center bg-no-repeat transition group-hover:rotate-6 group-hover:scale-110"
              style={{
                maxWidth: "13rem",
                backgroundImage: `url('${promo.imageUrl}')`,
              }}
            />
          )}
        </div>
      </a>
    </div>
  );
}
