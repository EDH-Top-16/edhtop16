import cn from "classnames";
import { ColorIdentity } from "../assets/icons/colors";

function CardIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 640 512"
      className="w-6"
    >
      <path
        fill="#6CA6EA"
        d="M27.8 118.8C1.2 134.2-7.9 168.2 7.5 194.9l167 289.3c15.4 26.6 49.4 35.8 76.1 20.4L443.4 393.2c26.6-15.4 35.8-49.4 20.4-76.1L296.8 27.8C281.4 1.2 247.3-7.9 220.7 7.5L27.8 118.8zM459.4 420.9L324.1 499c9.7 8.1 22.2 13 35.9 13H584c30.9 0 56-25.1 56-56V120c0-30.9-25.1-56-56-56H360c-1.8 0-3.5 .1-5.3 .2L491.5 301.1c24.2 41.9 9.8 95.6-32.1 119.8z"
      />
    </svg>
  );
}

export interface EntryProps {
  rank: string | number;
  name: string;
  href?: string;
  metadata?: [string, string | number, showOnMobile?: boolean][];
  colorIdentity?: string;
  tournament?: string;
  layout?: "default" | "WLD";
}

export function Entry({
  rank,
  name,
  href,
  metadata,
  colorIdentity,
  tournament,
  layout = "default",
}: EntryProps) {
  return (
    <tr className="my-3 grid grid-cols-3 grid-rows-2 rounded-lg px-4 py-2 text-lg text-cadet shadow-modal dark:text-white sm:py-0 md:my-0 md:table-row md:px-0 md:[&>td]:py-3">
      {rank && (
        <td className="hidden text-lightText dark:text-text md:table-cell md:px-4">
          {rank}
        </td>
      )}

      {name && (
        <td className="col-span-2 col-start-1 font-semibold md:px-4">
          <span className="space-x-2 text-lg font-semibold md:space-x-0">
            {rank && (
              <span className="text-sm text-lightText dark:text-text md:hidden">
                #{rank}
              </span>
            )}

            <a href={href} target="_blank" rel="noreferrer">
              {name}
              {href != null && layout === "WLD" && <CardIcon />}
            </a>

            <span className="text-sm text-lightText dark:text-text md:hidden">
              ({metadata?.at(-1)?.[1]})
            </span>
          </span>
        </td>
      )}

      {layout === "default" &&
        metadata?.map(([key, data, showOnMobile = true]) => {
          return (
            <td
              key={key}
              className={cn(
                showOnMobile ? "flex" : "hidden",
                "col-start-3 justify-end text-sm md:col-auto md:table-cell md:text-base",
              )}
            >
              <span className="md:hidden">{key}:&nbsp;</span>
              {data}
            </td>
          );
        })}

      {metadata && layout === "WLD" && (
        <td className="col-start-3 flex justify-end text-sm md:hidden md:px-4">
          St / W / L / D
        </td>
      )}

      {metadata && layout === "WLD" && (
        <td className="col-start-3 row-start-2 flex justify-end text-sm md:hidden md:px-4">
          {metadata
            .filter((data, i, a) => i < a.length - 1)
            .map(([key, data]) => data)
            .join(" / ")}
        </td>
      )}

      {colorIdentity && (
        <td className="col-span-2 col-start-1 row-start-2 !m-0 flex flex-wrap items-center gap-2 px-2 align-middle md:table-cell md:px-4">
          <ColorIdentity identity={colorIdentity} />
        </td>
      )}

      {tournament && (
        <td className="col-span-2 col-start-1 flex text-sm md:table-cell md:px-4">
          {tournament}
        </td>
      )}
    </tr>
  );
}
