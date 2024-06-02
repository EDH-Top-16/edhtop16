import {
  QueryParamKind,
  parseQuery,
  useQueryParams,
} from "@reverecre/next-query-params";
import cn from "classnames";
import { PropsWithChildren } from "react";
import { graphql, useFragment, usePreloadedQuery } from "react-relay/hooks";
import { RelayProps, withRelay } from "relay-nextjs";
import { Banner } from "../../components/banner/banner";
import { Entry } from "../../components/entry";
import { Navigation } from "../../components/nav";
import { getClientEnvironment } from "../../lib/client/relay_client_environment";
import { commanders_CommanderTableRow$key } from "../../queries/__generated__/commanders_CommanderTableRow.graphql";
import { commanders_CommandersQuery } from "../../queries/__generated__/commanders_CommandersQuery.graphql";
import { commanders_CommandersTableData$key } from "../../queries/__generated__/commanders_CommandersTableData.graphql";

function CommandersTableColumnHeader({
  hideOnMobile,
  children,
  ...props
}: PropsWithChildren<{ id?: string; hideOnMobile?: boolean }>) {
  const sortDirection = undefined;

  return (
    <th
      className={cn("text-left", {
        "hidden lg:table-cell": hideOnMobile,
        "hover:cursor-pointer": true,
      })}
      {...props}
    >
      {children}
      <span className={cn("ml-1", { invisible: sortDirection == null })}>
        {sortDirection === "ascending" ? "⬆️" : "⬇️"}
      </span>
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
    <table className="w-full border-separate border-spacing-y-3">
      <thead>
        <tr>
          <CommandersTableColumnHeader hideOnMobile id="rank">
            Rank
          </CommandersTableColumnHeader>
          <CommandersTableColumnHeader>
            <span className="hidden lg:inline">Commander</span>
          </CommandersTableColumnHeader>
          <CommandersTableColumnHeader hideOnMobile id="count">
            Top 16s
          </CommandersTableColumnHeader>
          <CommandersTableColumnHeader hideOnMobile id="entries">
            Entries
          </CommandersTableColumnHeader>
          <CommandersTableColumnHeader hideOnMobile id="conversion">
            Conversion
          </CommandersTableColumnHeader>
          <CommandersTableColumnHeader hideOnMobile>
            Colors
          </CommandersTableColumnHeader>
        </tr>
      </thead>
      <tbody>
        {commanders.map((c, i) => {
          return <CommandersTableRow key={c.name} rank={i + 1} commander={c} />;
        })}
      </tbody>
    </table>
  );
}

function CommandersPageShell({ children }: PropsWithChildren<{}>) {
  const [queryParams, updateQueryParams] = useQueryParams({
    minSize: QueryParamKind.STRING,
    standing: QueryParamKind.STRING,
  });

  return (
    <div className="flex h-screen w-screen bg-secondary">
      <Navigation />
      <div className="flex flex-grow flex-col overflow-auto">
        <Banner
          title="View Decks"
          enableSearchbar
          filters={[
            {
              displayName: "Tournament Size",
              variableName: "minSize",
              currentValue: queryParams.minSize,
              selectOptions: [
                ["≥ 64", "64"],
                ["≥ 128", "128"],
                ["≥ 256", "256"],
              ],
            },
          ]}
          onFilterChange={(variable, value) => {
            updateQueryParams({ [variable]: value });
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
  query commanders_CommandersQuery($filters: Filters) {
    commanders(filters: $filters) {
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
  fallback: <CommandersPageShell />,
  createClientEnvironment: () => getClientEnvironment()!,
  createServerEnvironment: async (ctx) => {
    const { createServerEnvironment } = await import(
      "../../lib/server/relay_server_environment"
    );

    return createServerEnvironment();
  },
  variablesFromContext: (ctx) => {
    const filters = parseQuery(ctx.query, {
      minSize: QueryParamKind.NUMBER,
    });

    return { filters };
  },
});
