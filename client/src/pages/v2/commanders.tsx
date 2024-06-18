import {
  QueryParamKind,
  parseQuery,
  useQueryParams,
} from "@reverecre/next-query-params";
import cn from "classnames";
import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { graphql, useFragment, usePreloadedQuery } from "react-relay/hooks";
import { RelayProps, withRelay } from "relay-nextjs";
import { HiSwitchHorizontal } from "react-icons/hi";
import { RxCaretSort, RxChevronDown, RxChevronUp } from "react-icons/rx";
import { Banner } from "../../components/banner/banner";
import { Entry } from "../../components/entry";
import { Navigation } from "../../components/nav";
import { getClientEnvironment } from "../../lib/client/relay_client_environment";
import { commanders_CommanderTableRow$key } from "../../queries/__generated__/commanders_CommanderTableRow.graphql";
import {
  CommanderSortBy,
  SortDirection,
  commanders_CommandersQuery,
} from "../../queries/__generated__/commanders_CommandersQuery.graphql";
import { commanders_CommandersTableData$key } from "../../queries/__generated__/commanders_CommandersTableData.graphql";
import Head from "next/head";

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

function CommandersTableColumnHeader({
  hideOnMobile,
  sortVariable,
  isPlaceholder = false,
  children,
  ...props
}: PropsWithChildren<{
  id: string;
  hideOnMobile?: boolean;
  sortVariable?: string;
  isPlaceholder?: boolean;
}>) {
  const [{ sortBy = "TOP_CUTS", sortDir = "DESC" }, setSort] = useQueryParams({
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

  const [headerRef, lastKnownSize] = useLastKnownSizeObserver(props.id);

  return (
    <th
      ref={headerRef}
      className={cn("text-left", {
        "hidden lg:table-cell": hideOnMobile,
        "hover:cursor-pointer": true,
      })}
      style={{ width: isPlaceholder ? lastKnownSize : undefined }}
      {...props}
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

function CommandersTableRow({
  rank,
  ...props
}: {
  rank: number;
  commander: commanders_CommanderTableRow$key;
}) {
  const commander = useFragment(
    graphql`
      fragment commanders_CommanderTableRow on Commander {
        name
        breakdownUrl
        colorId
        count(filters: $filters)
        topCuts(filters: $filters)
        conversionRate(filters: $filters)
      }
    `,
    props.commander,
  );

  return (
    <Entry
      rank={rank}
      name={commander.name}
      href={commander.breakdownUrl}
      metadata={[
        ["Top X", commander.topCuts],
        ["Entries", commander.count],
        [
          "Conversion",
          `${Math.round(commander.conversionRate * 10000) / 100}%`,
          false,
        ],
      ]}
      colorIdentity={commander.colorId}
    />
  );
}

function CommandersTableLayout({
  isPlaceholder = false,
  ...props
}: PropsWithChildren<{ isPlaceholder?: boolean }>) {
  return (
    <table className="w-full border-separate border-spacing-y-3">
      <thead className="hidden lg:table-header-group">
        <tr>
          <CommandersTableColumnHeader
            isPlaceholder={isPlaceholder}
            hideOnMobile
            id="rank"
          >
            Rank
          </CommandersTableColumnHeader>

          <CommandersTableColumnHeader
            isPlaceholder={isPlaceholder}
            id="name"
            sortVariable="NAME"
          >
            <span className="hidden lg:inline">Commander</span>
          </CommandersTableColumnHeader>

          <CommandersTableColumnHeader
            isPlaceholder={isPlaceholder}
            hideOnMobile
            id="count"
            sortVariable="TOP_CUTS"
          >
            Top 16s
          </CommandersTableColumnHeader>

          <CommandersTableColumnHeader
            isPlaceholder={isPlaceholder}
            hideOnMobile
            id="entries"
            sortVariable="ENTRIES"
          >
            Entries
          </CommandersTableColumnHeader>

          <CommandersTableColumnHeader
            isPlaceholder={isPlaceholder}
            hideOnMobile
            id="conversion"
            sortVariable="CONVERSION"
          >
            Conversion
          </CommandersTableColumnHeader>

          <CommandersTableColumnHeader
            isPlaceholder={isPlaceholder}
            hideOnMobile
            id="colors"
          >
            Colors
          </CommandersTableColumnHeader>
        </tr>
      </thead>

      <tbody>{props.children}</tbody>
    </table>
  );
}

function CommandersTable(props: {
  commanders: commanders_CommandersTableData$key;
}) {
  const commanders = useFragment(
    graphql`
      fragment commanders_CommandersTableData on Commander
      @relay(plural: true) {
        name
        topCuts(filters: $filters)
        count(filters: $filters)
        conversionRate(filters: $filters)

        ...commanders_CommanderTableRow
      }
    `,
    props.commanders,
  );

  return (
    <CommandersTableLayout>
      {commanders.map((c, i) => {
        return <CommandersTableRow key={c.name} rank={i + 1} commander={c} />;
      })}
    </CommandersTableLayout>
  );
}

function CommandersPageShell({ children }: PropsWithChildren<{}>) {
  const [queryParams, updateQueryParams] = useQueryParams({
    minSize: QueryParamKind.STRING,
    maxSize: QueryParamKind.STRING,
    minEntries: QueryParamKind.STRING,
    maxEntries: QueryParamKind.STRING,
    minDate: QueryParamKind.STRING,
    maxDate: QueryParamKind.STRING,
    colorId: QueryParamKind.STRING,
  });

  const oneYearAgo = useMemo(() => {
    const now = new Date();
    now.setUTCFullYear(now.getUTCFullYear() - 1);
    return now.toISOString().split("T")[0];
  }, []);

  return (
    <div className="flex h-screen w-screen bg-secondary">
      <Navigation />
      <div className="flex flex-grow flex-col overflow-auto">
        <Banner
          title="View Decks"
          enableSearchbar
          filters={[
            {
              displayName: "Colors",
              variableName: "colorId",
              currentValue: queryParams.colorId,
              inputType: "colorId",
            },
            {
              displayName: "Entries",
              label: "Entries",
              variableName: [
                {
                  variableName: "minEntries",
                  label: "is greater than (≥)",
                  shortLabel: "≥",
                  currentValue: queryParams.minEntries,
                },
                {
                  variableName: "maxEntries",
                  label: "is less than (≤)",
                  shortLabel: "≤",
                  currentValue: queryParams.maxEntries,
                },
              ],
              inputType: "number",
            },
            {
              displayName: "Tournament Size",
              label: "Tournament Size",
              variableName: [
                {
                  variableName: "minSize",
                  label: "is greater than (≥)",
                  shortLabel: "≥",
                  currentValue:
                    queryParams.minSize == null && queryParams.maxSize == null
                      ? "64"
                      : queryParams.minSize,
                },
                {
                  variableName: "maxSize",
                  label: "is less than (≤)",
                  shortLabel: "≤",
                  currentValue: queryParams.maxSize,
                },
              ],
              inputType: "number",
            },
            {
              displayName: "Tournament Date",
              variableName: [
                {
                  variableName: "minDate",
                  label: "is after (≥)",
                  shortLabel: "≥",
                  currentValue:
                    queryParams.minDate == null && queryParams.maxDate == null
                      ? oneYearAgo
                      : queryParams.minDate,
                },
                {
                  variableName: "maxDate",
                  label: "is before (≤)",
                  shortLabel: "≤",
                  currentValue: queryParams.maxDate,
                },
              ],
              inputType: "date",
            },
          ]}
          onFilterChange={(nextValues) => {
            updateQueryParams(nextValues as any);
          }}
        />

        <main className="w-full bg-secondary px-2 py-4 text-white md:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}

const CommandersQuery = graphql`
  query commanders_CommandersQuery(
    $filters: Filters
    $sortBy: CommanderSortBy
    $sortDir: SortDirection
  ) {
    commanders(filters: $filters, sortBy: $sortBy, sortDir: $sortDir) {
      ...commanders_CommandersTableData
    }
  }
`;

function CommandersPage({
  preloadedQuery,
}: RelayProps<{}, commanders_CommandersQuery>) {
  const { commanders } = usePreloadedQuery(CommandersQuery, preloadedQuery);

  return (
    <>
      <Head>
        <title>EDH Top16</title>
      </Head>
      <CommandersPageShell>
        <CommandersTable commanders={commanders} />
      </CommandersPageShell>
    </>
  );
}

export default withRelay(CommandersPage, CommandersQuery, {
  fallback: (
    <CommandersPageShell>
      <CommandersTableLayout isPlaceholder />
    </CommandersPageShell>
  ),
  createClientEnvironment: () => getClientEnvironment()!,
  createServerEnvironment: async (ctx) => {
    const { createServerEnvironment } = await import(
      "../../lib/server/relay_server_environment"
    );

    return createServerEnvironment();
  },
  variablesFromContext: (ctx) => {
    let { sortBy, sortDir, ...filters } = parseQuery(ctx.query, {
      sortBy: QueryParamKind.STRING,
      sortDir: QueryParamKind.STRING,
      minSize: QueryParamKind.NUMBER,
      minEntries: QueryParamKind.NUMBER,
      minDate: QueryParamKind.STRING,
      maxSize: QueryParamKind.NUMBER,
      maxEntries: QueryParamKind.NUMBER,
      maxDate: QueryParamKind.STRING,
      colorId: QueryParamKind.STRING,
    });

    if (filters.minSize == null && filters.maxSize == null) {
      filters = { ...filters, minSize: 64 };
    }

    if (filters.minDate == null && filters.maxDate == null) {
      const now = new Date();
      now.setUTCFullYear(now.getUTCFullYear() - 1);
      filters = { ...filters, minDate: now.toISOString().split("T")[0] };
    }

    if (
      (sortBy != null && !isSortBy(sortBy)) ||
      (sortDir != null && !isSortDir(sortDir))
    ) {
      return { filters };
    }

    return { sortBy, sortDir, filters };
  },
});

function isSortBy(s: string): s is CommanderSortBy {
  return ["ENTRIES", "TOP_CUTS", "NAME", "CONVERSION"].includes(s);
}

function isSortDir(s: string): s is SortDirection {
  return ["ASC", "DESC"].includes(s);
}
