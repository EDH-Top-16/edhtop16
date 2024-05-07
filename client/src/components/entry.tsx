import { Cell, Row } from "react-aria-components";
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

interface EntryProps {
  rank: string | number;
  name: string;
  decklistLink?: string;
  metadata?: string[];
  colorIdentity?: string;
  tournament?: string;
  metadata_fields?: string[];
  layout?: "default" | "WLD";
}

export function Entry({
  rank,
  name,
  decklistLink,
  metadata,
  colorIdentity,
  tournament,
  metadata_fields,
  layout = "default",
}: EntryProps) {
  return (
    <Row className="text-cadet shadow-modal grid grid-cols-3 grid-rows-2 rounded-lg py-2 text-lg dark:text-white sm:py-0 md:table-row md:[&>td]:py-3">
      {rank && (
        <Cell className="text-lightText dark:text-text hidden md:table-cell">
          {rank}
        </Cell>
      )}

      {name && (
        <Cell className="col-span-2 col-start-1 font-semibold">
          <span className="flex items-center gap-1 text-lg font-semibold">
            {rank && (
              <span className="text-lightText dark:text-text text-sm md:hidden">
                #{rank}
              </span>
            )}

            <a href={decklistLink} target="_blank" rel="noreferrer">
              {name}
              {decklistLink && <CardIcon />}
            </a>

            <span className="text-lightText dark:text-text text-sm md:hidden">
              ({metadata?.at(-1)})
            </span>
          </span>
        </Cell>
      )}

      {metadata?.map((data, i) => (
        <Cell key={i} className="hidden md:table-cell">
          {data}
        </Cell>
      ))}

      {layout === "default" &&
        metadata?.map(
          (data, i, a) =>
            i < a.length - 1 && (
              <Cell
                key={i}
                className="col-start-3 flex justify-end text-sm md:hidden"
              >
                {metadata_fields?.[i]}: {data}
              </Cell>
            ),
        )}

      {metadata && layout === "WLD" && (
        <Cell className="col-start-3 flex justify-end text-sm md:hidden">
          St / W / L / D
        </Cell>
      )}

      {metadata && layout === "WLD" && (
        <Cell className="col-start-3 row-start-2 flex justify-end text-sm md:hidden">
          {metadata.filter((data, i, a) => i < a.length - 1).join(" / ")}
        </Cell>
      )}

      {colorIdentity && (
        <Cell className="col-span-2 col-start-1 row-start-2 !m-0 flex flex-wrap gap-2 px-2 align-middle">
          <ColorIdentity identity={colorIdentity} />
        </Cell>
      )}

      {tournament && (
        <Cell className="col-span-2 col-start-1 flex text-sm md:table-cell">
          {tournament}
        </Cell>
      )}
    </Row>
  );
}
