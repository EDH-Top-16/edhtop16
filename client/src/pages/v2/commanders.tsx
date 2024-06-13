import {
  QueryParamKind,
  parseQuery,
  useQueryParams,
} from "@reverecre/next-query-params";
import cn from "classnames";
import { PropsWithChildren, useCallback, useMemo } from "react";
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

function CommandersTableColumnHeader({
  hideOnMobile,
  sortVariable,
  children,
  ...props
}: PropsWithChildren<{
  id: string;
  hideOnMobile?: boolean;
  sortVariable?: string;
}>) {
  const [{ sortBy = "TOP_CUTS", sortDir = "DESC" }, setSort] = useQueryParams({
    sortBy: QueryParamKind.STRING,
    sortDir: QueryParamKind.STRING,
  });

  const toggleSort = useCallback(() => {
    setSort({
      sortBy: sortVariable,
      sortDir: sortDir === "ASC" ? "DESC" : "ASC",
    });
  }, [setSort, sortDir, sortVariable]);

  return (
    <th
      className={cn("text-left", {
        "hidden lg:table-cell": hideOnMobile,
        "hover:cursor-pointer": true,
      })}
      {...props}
    >
      <div className="flex items-center gap-x-1" onClick={toggleSort}>
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
      metadata={[
        ["Top X", commander.topCuts],
        ["Entries", commander.count],
        ["Conversion", `${Math.round(commander.conversionRate * 100)}%`, false],
      ]}
      colorIdentity={commander.colorId}
    />
  );
}

function CommandersTableLayout(props: PropsWithChildren<{}>) {
  return (
    <table className="w-full border-separate border-spacing-y-3">
      <thead>
        <tr>
          <CommandersTableColumnHeader hideOnMobile id="rank">
            Rank
          </CommandersTableColumnHeader>

          <CommandersTableColumnHeader id="name">
            <span className="hidden lg:inline">Commander</span>
          </CommandersTableColumnHeader>

          <CommandersTableColumnHeader
            hideOnMobile
            id="count"
            sortVariable="TOP_CUTS"
          >
            Top 16s
          </CommandersTableColumnHeader>

          <CommandersTableColumnHeader
            hideOnMobile
            id="entries"
            sortVariable="ENTRIES"
          >
            Entries
          </CommandersTableColumnHeader>

          <CommandersTableColumnHeader hideOnMobile id="conversion">
            Conversion
          </CommandersTableColumnHeader>

          <CommandersTableColumnHeader hideOnMobile id="colors">
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
    minEntries: QueryParamKind.STRING,
    minDate: QueryParamKind.STRING,
    colorId: QueryParamKind.STRING,
  });

  const tomorrow = useMemo(() => {
    const now = new Date();
    now.setDate(now.getDate() + 1);
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
              label: "Entries ≥",
              variableName: "minEntries",
              currentValue: queryParams.minEntries ?? "10",
              inputType: "number",
            },
            {
              displayName: "Tournament Size",
              label: "Tournament Size ≥",
              variableName: "minSize",
              currentValue: queryParams.minSize ?? "64",
              inputType: "number",
            },
            {
              displayName: "Tournament Date",
              variableName: "minDate",
              currentValue: queryParams.minDate ?? tomorrow,
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
    <CommandersPageShell>
      <CommandersTable commanders={commanders} />
    </CommandersPageShell>
  );
}

export default withRelay(CommandersPage, CommandersQuery, {
  fallback: (
    <CommandersPageShell>
      <CommandersTableLayout />
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
    const { sortBy, sortDir, ...filters } = parseQuery(ctx.query, {
      sortBy: QueryParamKind.STRING,
      sortDir: QueryParamKind.STRING,
      minSize: QueryParamKind.NUMBER,
      minEntries: QueryParamKind.NUMBER,
      minDate: QueryParamKind.STRING,
      colorId: QueryParamKind.STRING,
    });

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
  return ["ENTRIES", "TOP_CUTS"].includes(s);
}

function isSortDir(s: string): s is SortDirection {
  return ["ASC", "DESC"].includes(s);
}
