import { QueryParamKind, useQueryParams } from "@reverecre/next-query-params";
import cn from "classnames";
import { PropsWithChildren, useCallback, useEffect, useRef } from "react";
import { HiSwitchHorizontal } from "react-icons/hi";
import { RxCaretSort, RxChevronDown, RxChevronUp } from "react-icons/rx";
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

interface TableEntryProps {
  rank: string | number;
  name: string;
  href?: string;
  metadata?: [string, string | number, showOnMobile?: boolean][];
  colorIdentity?: string;
  tournament?: string;
  layout?: "default" | "WLD";
}

function TableEntry({
  rank,
  name,
  href,
  metadata,
  colorIdentity,
  tournament,
  layout = "default",
}: TableEntryProps) {
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

/** Recalls the last known size of a given element, identified by `id`.
 *
 * @returns A tuple of a ref to assign to the element, along with the last seen width.
 */
function useLastKnownSizeObserver(id: string) {
  const lastKnownSizeKey = `last-known-size-${id}`;

  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (!ref.current) return;

    const observer = new ResizeObserver((entries) => {
      const headerEntry = entries[0];

      if (headerEntry.contentRect.width > 0) {
        (window as any)[lastKnownSizeKey] = headerEntry.contentRect.width;
      }
    });

    observer.observe(ref.current);
    return () => {
      observer.disconnect();
    };
  }, [id, lastKnownSizeKey]);

  return [
    ref,
    typeof window === "undefined" ? null : (window as any)[lastKnownSizeKey],
  ];
}

interface TableColumnHeaderProps {
  id: string;
  hideOnMobile?: boolean;
  sortVariable?: string;
  isPlaceholder?: boolean;
  defaultSort?: string;
}

function TableColumnHeader({
  id,
  hideOnMobile,
  sortVariable,
  isPlaceholder = false,
  defaultSort,
  children,
}: PropsWithChildren<TableColumnHeaderProps>) {
  const [{ sortBy = defaultSort, sortDir = "DESC" }, setSort] = useQueryParams({
    sortBy: QueryParamKind.STRING,
    sortDir: QueryParamKind.STRING,
  });

  const toggleSort = useCallback(() => {
    setSort({
      sortBy: sortVariable,
      sortDir:
        sortVariable !== sortBy ? "DESC" : sortDir === "ASC" ? "DESC" : "ASC",
    });
  }, [setSort, sortBy, sortDir, sortVariable]);

  const [headerRef, lastKnownSize] = useLastKnownSizeObserver(id);

  return (
    <th
      id={id}
      ref={headerRef}
      className={cn("text-left", {
        "hidden lg:table-cell": hideOnMobile,
        "hover:cursor-pointer": sortVariable != null,
      })}
      style={{ width: isPlaceholder ? lastKnownSize : undefined }}
    >
      <div className="hidden items-center gap-x-1 lg:flex" onClick={toggleSort}>
        <span
          className={cn("inline", {
            hidden: sortVariable == null || sortBy !== sortVariable,
          })}
        >
          <HiSwitchHorizontal />
        </span>

        {children}

        <span className={cn({ hidden: sortVariable == null })}>
          {sortBy !== sortVariable ? (
            <RxCaretSort />
          ) : sortDir === "ASC" ? (
            <RxChevronUp />
          ) : (
            <RxChevronDown />
          )}
        </span>
      </div>
    </th>
  );
}

export interface TableColumnConfig
  extends Omit<TableColumnHeaderProps, "defaultSort" | "isPlaceholder"> {
  displayName: string;
  showOnMobile?: boolean;
}

export interface TableRow
  extends Pick<TableEntryProps, "name" | "colorIdentity" | "href"> {
  id: string;
  metadata: Record<string, string | number>;
}

export interface TableProps<Row extends TableRow> {
  data?: Row[];
  columns: TableColumnConfig[];
  defaultSort?: string;
  layout?: "default" | "WLD";
}

export function Table<Row extends TableRow>({
  defaultSort,
  columns,
  data,
  layout,
}: TableProps<Row>) {
  return (
    <table className="w-full border-separate border-spacing-y-3">
      <thead className="hidden lg:table-header-group">
        <tr>
          {[{ id: "rank", displayName: "Rank" }, ...columns].map(
            ({ displayName, ...config }) => {
              return (
                <TableColumnHeader
                  key={config.id}
                  defaultSort={defaultSort}
                  isPlaceholder={data == null}
                  hideOnMobile={displayName !== "name"}
                  {...config}
                >
                  {config.hideOnMobile ? (
                    displayName
                  ) : (
                    <span className="hidden lg:inline">{displayName}</span>
                  )}
                </TableColumnHeader>
              );
            },
          )}
        </tr>
      </thead>

      {data && (
        <tbody>
          {data.map((row, i) => (
            <TableEntry
              key={row.id}
              layout={layout}
              rank={i + 1}
              name={row.name}
              href={row.href}
              colorIdentity={row.colorIdentity}
              metadata={columns
                .filter((c) => c.id !== "name" && c.id !== "colors")
                .map(
                  (c) =>
                    [
                      c.displayName,
                      row.metadata[c.id],
                      c.showOnMobile,
                    ] as const,
                )}
            />
          ))}
        </tbody>
      )}
    </table>
  );
}
