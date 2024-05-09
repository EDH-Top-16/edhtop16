import cn from "classnames";
import { useRouter } from "next/router";
import { PropsWithChildren, useCallback, useMemo, useRef } from "react";
import {
  Button,
  Cell,
  CellProps,
  Column,
  ColumnProps,
  Key,
  Menu,
  MenuItem,
  MenuTrigger,
  Popover,
  Row,
  SortDescriptor,
  Table,
  TableBody,
  TableHeader,
} from "react-aria-components";
import { graphql, useFragment, usePreloadedQuery } from "react-relay/hooks";
import { RelayProps, withRelay } from "relay-nextjs";
import { ColorIdentity } from "../../assets/icons/colors";
import { Banner } from "../../components/banner/banner";
import { Searchbar } from "../../components/banner/searchbar";
import { Navigation } from "../../components/nav";
import { getClientEnvironment } from "../../lib/client/relay_client_environment";
import { commanders_CommanderTableRow$key } from "../../queries/__generated__/commanders_CommanderTableRow.graphql";
import { commanders_CommanderTableRowMobileView$key } from "../../queries/__generated__/commanders_CommanderTableRowMobileView.graphql";
import { commanders_CommandersQuery } from "../../queries/__generated__/commanders_CommandersQuery.graphql";
import { commanders_CommandersTableData$key } from "../../queries/__generated__/commanders_CommandersTableData.graphql";
import { Entry } from "../../components/entry";

function CommandersTableColumnHeader({
  hideOnMobile,
  className,
  children,
  ...props
}: { hideOnMobile?: boolean } & ColumnProps) {
  return (
    <Column
      className={cn(className, "text-left", {
        "hidden lg:table-cell": hideOnMobile,
        "hover:cursor-pointer": props.allowsSorting,
      })}
      {...props}
    >
      {({ sortDirection }) => {
        return (
          <>
            {children}
            <span className={cn("ml-1", { invisible: sortDirection == null })}>
              {sortDirection === "ascending" ? "⬆️" : "⬇️"}
            </span>
          </>
        );
      }}
    </Column>
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
        { "hidden lg:table-cell": hideOnMobile },
        "text-gray-100 border-b border-zinc-100/20 py-4 text-lg",
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
      fragment commanders_CommanderTableRowMobileView on Commander {
        name
        colorId
        topCuts
        conversionRate
        count
      }
    `,
    props.commander,
  );

  return (
    <div className="mb-4 grid h-16 grid-cols-[1fr_auto] items-baseline gap-x-3 gap-y-2 lg:hidden">
      <div>
        <span className="mr-2 text-sm font-semibold text-indigo-300">
          #{rank}
        </span>
        <span className="font-semibold">{commander.name}</span>
      </div>

      <div className="text-gray-200 flex flex-col items-end text-sm">
        <div>Top X: {commander.topCuts}</div>
        <div>
          {commander.conversionRate && (
            <span className="ml-2 text-sm font-semibold text-indigo-300">
              ({Math.round(commander.conversionRate * 100)}%)
            </span>
          )}
        </div>
      </div>

      <div>
        {commander.colorId && <ColorIdentity identity={commander.colorId} />}
      </div>

      <div className="text-gray-200 flex flex-col items-end text-sm">
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
      fragment commanders_CommanderTableRow on Commander {
        name
        colorId
        count
        topCuts
        conversionRate

        ...commanders_CommanderTableRowMobileView
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

function useTableSort(
  initialKeys: string[],
): [SortDescriptor, (next: SortDescriptor) => void] {
  const keys = useRef(initialKeys);
  const router = useRouter();

  const sortDescriptor = useMemo(() => {
    const descriptor: SortDescriptor = {};

    if (
      typeof router.query.sort === "string" &&
      keys.current.includes(router.query.sort)
    ) {
      descriptor.column = router.query.sort as Key;
    }

    if (router.query.dir === "ascending" || router.query.dir === "descending") {
      descriptor.direction = router.query.dir;
    }

    return descriptor;
  }, [router.query.dir, router.query.sort]);

  const updateSort = useCallback(
    ({ column, direction }: SortDescriptor) => {
      const nextUrl = new URL(window.location.href);

      if (column) {
        nextUrl.searchParams.set("sort", `${column}`);
      } else {
        nextUrl.searchParams.delete("sort");
      }

      if (direction) {
        nextUrl.searchParams.set("dir", direction);
      } else {
        nextUrl.searchParams.delete("dir");
      }

      router.push(nextUrl.href, undefined, { shallow: true });
    },
    [router],
  );

  return [sortDescriptor, updateSort];
}

const TABLE_KEYS = ["rank", "count", "entries", "conversion"];

function CommandersTable(props: {
  commanders: commanders_CommandersTableData$key;
}) {
  const commanders = useFragment(
    graphql`
      fragment commanders_CommandersTableData on Commander
      @relay(plural: true) {
        name
        topCuts
        count
        conversionRate

        ...commanders_CommanderTableRow
      }
    `,
    props.commanders,
  );

  const [sort, updateSort] = useTableSort(TABLE_KEYS);
  const sortedCommanders = useMemo(() => {
    const op = (a: number, b: number) =>
      sort.direction === "descending" ? a - b : b - a;

    return Array.from(commanders.entries()).sort(([rankA, a], [rankB, b]) => {
      if (sort.column === "count") {
        return op(a.topCuts ?? 0, b.topCuts ?? 0);
      } else if (sort.column === "entries") {
        return op(a.count ?? 0, b.count ?? 0);
      } else if (sort.column === "conversion") {
        return op(a.conversionRate ?? 0, b.conversionRate ?? 0);
      } else {
        return op(rankB, rankA);
      }
    });
  }, [commanders, sort]);

  return (
    <Table
      className="w-full border-separate border-spacing-y-3"
      sortDescriptor={sort}
      onSortChange={updateSort}
    >
      <TableHeader>
        <CommandersTableColumnHeader hideOnMobile allowsSorting id="rank">
          Rank
        </CommandersTableColumnHeader>
        <CommandersTableColumnHeader isRowHeader>
          <span className="hidden lg:inline">Commander</span>
        </CommandersTableColumnHeader>
        <CommandersTableColumnHeader hideOnMobile allowsSorting id="count">
          Top 16s
        </CommandersTableColumnHeader>
        <CommandersTableColumnHeader hideOnMobile allowsSorting id="entries">
          Entries
        </CommandersTableColumnHeader>
        <CommandersTableColumnHeader hideOnMobile allowsSorting id="conversion">
          Conversion
        </CommandersTableColumnHeader>
        <CommandersTableColumnHeader hideOnMobile>
          Colors
        </CommandersTableColumnHeader>
      </TableHeader>
      <TableBody>
        {sortedCommanders.map(([_originalRank, c], i, { length }) => {
          const rank = sort.direction === "descending" ? length - i : i + 1;
          return <CommandersTableRow key={c.name} rank={rank} commander={c} />;
        })}
      </TableBody>
    </Table>
  );
}

interface ActionMenuProps<T> {
  items: Map<T, string>;
  onAction: (t: T) => void;
}

function ActionMenu<T extends string>({
  items,
  onAction,
  children,
}: PropsWithChildren<ActionMenuProps<T>>) {
  return (
    <MenuTrigger>
      <Button className="bg-gray-50 cursor-pointer rounded p-2 !outline-none">
        {children}
      </Button>
      <Popover>
        <Menu onAction={(e) => onAction(e as T)} className="!outline-none">
          {Array.from(items.entries()).map(([key, display], i, { length }) => {
            return (
              <MenuItem
                key={key}
                id={key}
                className={cn(
                  "bg-gray-50 cursor-pointer px-2 pb-1 pt-2 !outline-none hover:bg-indigo-500 hover:text-white",
                  i === 0
                    ? "rounded-t pb-1 pt-2"
                    : i === length - 1
                    ? "rounded-b pb-2 pt-1"
                    : "py-1",
                )}
              >
                {display}
              </MenuItem>
            );
          })}
        </Menu>
      </Popover>
    </MenuTrigger>
  );
}

function MobileSortMenus() {
  const items = useMemo(() => {
    return new Map([
      ["rank", "Rank"],
      ["count", "Count"],
      ["entries", "Entries"],
      ["conversion", "Conversion"],
    ]);
  }, []);

  const [sort, setSort] = useTableSort(Array.from(items.keys()));

  return (
    <div className="flex space-x-2 lg:hidden">
      <ActionMenu
        items={items}
        onAction={(nextColumn) => {
          setSort({
            direction: sort.direction ?? "ascending",
            column: nextColumn,
          });
        }}
      >
        Sort By
      </ActionMenu>

      {sort.direction != null && (
        <ActionMenu
          items={
            new Map([
              ["ascending", "Asc"],
              ["descending", "Desc"],
            ])
          }
          onAction={(nextDirection) => {
            setSort({ ...sort, direction: nextDirection });
          }}
        >
          Sort Direction
        </ActionMenu>
      )}
    </div>
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
          <MobileSortMenus />
        </Banner>

        <main className="w-full bg-secondary px-2 py-4 text-white md:px-8">
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
      "../../lib/server/relay_server_environment"
    );

    return createServerEnvironment();
  },
});
