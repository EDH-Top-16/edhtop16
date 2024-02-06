import cn from "classnames";
import {
  Cell,
  CellProps,
  Column,
  ColumnProps,
  Row,
  Table,
  TableBody,
  TableHeader,
} from "react-aria-components";
import { graphql, useFragment, usePreloadedQuery } from "react-relay/hooks";
import { RelayProps, withRelay } from "relay-nextjs";
import { ColorIdentity } from "../assets/icons/colors";
import { Banner } from "../components/banner/banner";
import { Searchbar } from "../components/banner/searchbar";
import { Navigation } from "../components/nav";
import { getClientEnvironment } from "../lib/client/relay_client_environment";
import { commanders_CommanderTableRow$key } from "../queries/__generated__/commanders_CommanderTableRow.graphql";
import { commanders_CommandersQuery } from "../queries/__generated__/commanders_CommandersQuery.graphql";
import { commanders_CommandersTableData$key } from "../queries/__generated__/commanders_CommandersTableData.graphql";
import { commanders_CommanderTableRowMobileView$key } from "../queries/__generated__/commanders_CommanderTableRowMobileView.graphql";

function CommandersTableColumnHeader({
  hideOnMobile,
  className,
  ...props
}: { hideOnMobile?: boolean } & ColumnProps) {
  return (
    <Column
      className={cn(
        className,
        { "hidden md:table-cell": hideOnMobile },
        "text-left",
      )}
      {...props}
    />
  );
}

function CommanderTableDataCell({
  hideOnMobile,
  className,
  ...props
}: {
  hideOnMobile?: boolean;
} & CellProps) {
  return (
    <Cell
      className={cn(
        className,
        { "hidden md:table-cell": hideOnMobile },
        "border-b border-zinc-100/20 py-4 text-lg text-gray-100",
      )}
      {...props}
    />
  );
}

function CommanderTableRowMobileView({
  rank,
  ...props
}: {
  rank: number;
  commander: commanders_CommanderTableRowMobileView$key;
}) {
  const commander = useFragment(
    graphql`
      fragment commanders_CommanderTableRowMobileView on CommanderType {
        name
        colorID
        topCuts
        conversionRate
        count
      }
    `,
    props.commander,
  );

  return (
    <div className="mb-4 grid h-16 grid-cols-[1fr_auto] items-baseline gap-x-3 gap-y-2 md:hidden">
      <div>
        <span className="mr-2 text-sm font-semibold text-indigo-300">
          #{rank}
        </span>
        <span className="font-semibold">{commander.name}</span>
      </div>

      <div className="flex flex-col items-end text-sm text-gray-200">
        <div>Top X: {commander.topCuts}</div>
        <div>
          {commander.conversionRate && (
            <span className="ml-2 text-sm font-semibold text-indigo-300">
              ({Math.round(commander.conversionRate * 100) / 100}%)
            </span>
          )}
        </div>
      </div>

      <div>
        {commander.colorID && <ColorIdentity identity={commander.colorID} />}
      </div>

      <div className="flex flex-col items-end text-sm text-gray-200">
        <div>Entries: {commander.count}</div>
      </div>
    </div>
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
      fragment commanders_CommanderTableRow on CommanderType {
        name
        colorID
        wins
        winsSwiss
        winsBracket
        draws
        losses
        lossesSwiss
        lossesBracket
        count
        winRate
        winRateSwiss
        winRateBracket
        topCuts
        conversionRate
        colorID

        ...commanders_CommanderTableRowMobileView
      }
    `,
    props.commander,
  );

  return (
    <Row key={commander.name} className="">
      <CommanderTableDataCell hideOnMobile>{rank}</CommanderTableDataCell>
      <CommanderTableDataCell>
        <span className="hidden font-semibold md:inline">{commander.name}</span>
        <CommanderTableRowMobileView rank={rank} commander={commander} />
      </CommanderTableDataCell>
      <CommanderTableDataCell hideOnMobile>
        {commander.topCuts}
      </CommanderTableDataCell>
      <CommanderTableDataCell hideOnMobile>
        {commander.count}
      </CommanderTableDataCell>
      <CommanderTableDataCell hideOnMobile>
        {Math.round((commander.conversionRate ?? 0) * 100)}%
      </CommanderTableDataCell>
      <CommanderTableDataCell hideOnMobile>
        {commander.colorID && <ColorIdentity identity={commander.colorID} />}
      </CommanderTableDataCell>
    </Row>
  );
}

function CommandersTable(props: {
  commanders: commanders_CommandersTableData$key;
}) {
  const commanders = useFragment(
    graphql`
      fragment commanders_CommandersTableData on CommanderType
      @relay(plural: true) {
        name
        ...commanders_CommanderTableRow
      }
    `,
    props.commanders,
  );

  return (
    <Table className="w-full">
      <TableHeader>
        <CommandersTableColumnHeader hideOnMobile>
          Rank
        </CommandersTableColumnHeader>
        <CommandersTableColumnHeader isRowHeader>
          <span className="hidden md:inline">Commander</span>
        </CommandersTableColumnHeader>
        <CommandersTableColumnHeader hideOnMobile>
          Top 16s
        </CommandersTableColumnHeader>
        <CommandersTableColumnHeader hideOnMobile>
          Entries
        </CommandersTableColumnHeader>
        <CommandersTableColumnHeader hideOnMobile>
          Conversion
        </CommandersTableColumnHeader>
        <CommandersTableColumnHeader hideOnMobile>
          Colors
        </CommandersTableColumnHeader>
      </TableHeader>
      <TableBody>
        {commanders.map((c, i) => (
          <CommandersTableRow key={c.name} rank={i + 1} commander={c} />
        ))}
      </TableBody>
    </Table>
  );
}

const CommandersQuery = graphql`
  query commanders_CommandersQuery {
    commanders {
      ...commanders_CommandersTableData
    }
  }
`;

function CommandersPage({
  preloadedQuery,
}: RelayProps<{}, commanders_CommandersQuery>) {
  const { commanders } = usePreloadedQuery(CommandersQuery, preloadedQuery);

  return (
    <div className="flex h-screen w-screen bg-secondary">
      <Navigation />
      <div className="flex flex-grow flex-col overflow-auto">
        <Banner title="Commander Decks">
          <Searchbar placeholder="Find Commander..." />
        </Banner>

        <main className="w-full bg-secondary px-8 py-4 text-white">
          <CommandersTable commanders={commanders} />
        </main>
      </div>
    </div>
  );
}

export default withRelay(CommandersPage, CommandersQuery, {
  createClientEnvironment: () => getClientEnvironment()!,
  createServerEnvironment: async (ctx) => {
    const { createServerEnvironment } = await import(
      "../lib/server/relay_server_environment"
    );

    return createServerEnvironment();
  },
});
