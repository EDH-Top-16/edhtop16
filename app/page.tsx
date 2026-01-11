import {Card} from '@/components/card';
import {ColorIdentity} from '@/components/colors';
import {
  CommanderPageFilterMenu,
  CommanderPageFilters,
  DisplayStyleToggle,
} from '@/components/CommanderPageFilterMenu';
import {ListContainer, ListContainerState} from '@/components/ListContainer';
import {Footer} from '@/components/footer';
import {Navigation} from '@/components/navigation';
import {FirstPartyPromo} from '@/components/promo';
import {formatPercent} from '@/lib/client/format';
import {Commander, CommandersSortBy} from '@/lib/schema/commander';
import {Connection} from '@/lib/schema/connection';
import {homePagePromo} from '@/lib/schema/promo';
import {searchResults, SearchResultType} from '@/lib/schema/search';
import {TimePeriod} from '@/lib/schema/types';
import {
  CommanderStatsFilters,
  ListStyle,
  ViewerContext,
} from '@/lib/schema/ViewerContext';
import {cn} from '@/lib/utils';
import {Metadata} from 'next';
import Link from 'next/link';
import {PropsWithChildren, ReactNode} from 'react';
import {z} from 'zod/v4';

export const metadata: Metadata = {
  title: 'cEDH Commanders',
  description: 'Discover top performing commanders in cEDH!',
};

async function TopCommandersCard({
  commander,
  filters,
  display,
  secondaryStatistic,
}: {
  commander: Commander;
  filters: CommanderStatsFilters;
  display: ListStyle;
  secondaryStatistic: 'topCuts' | 'count';
}) {
  const [commanderStats, commanderCards] = await Promise.all([
    commander.stats(filters),
    commander.cards(),
  ]);

  const commanderStatsDisplay = (() => {
    const stats: string[] = [];

    if (secondaryStatistic === 'count') {
      stats.push(
        `Meta Share: ${formatPercent(commanderStats.metaShare)}`,
        `Entries: ${commanderStats.count}`,
      );
    } else if (secondaryStatistic === 'topCuts') {
      stats.push(
        `Conversion Rate: ${formatPercent(commanderStats.conversionRate)}`,
        `Top Cuts: ${commanderStats.topCuts}`,
      );
    }

    return stats.join(' / ');
  })();

  if (display === 'table') {
    return (
      <div className="grid w-full grid-cols-[130px_1fr] items-center gap-x-2 overflow-x-hidden rounded-sm bg-[#312d5a]/50 p-4 text-white shadow-md lg:grid-cols-[130px_minmax(350px,1fr)_100px_100px_100px_100px]">
        <div>
          <ColorIdentity identity={commander.colorId} />
        </div>

        <Link
          href={commander.breakdownUrl()}
          className="font-title mb-2 text-xl underline lg:mb-0 lg:font-sans lg:text-base"
        >
          {commander.name}
        </Link>

        <div className="text-sm opacity-75 lg:hidden">Entries:</div>
        <div className="text-sm">{commanderStats.count}</div>
        <div className="text-sm opacity-75 lg:hidden">Meta Share:</div>
        <div className="text-sm">{formatPercent(commanderStats.metaShare)}</div>
        <div className="text-sm opacity-75 lg:hidden">Top Cuts:</div>
        <div className="text-sm">{commanderStats.topCuts}</div>
        <div className="text-sm opacity-75 lg:hidden">Conversion Rate:</div>
        <div className="text-sm">
          {formatPercent(commanderStats.conversionRate)}
        </div>
      </div>
    );
  }

  return (
    <Card
      bottomText={commanderStatsDisplay}
      images={commanderCards
        .flatMap((c) => c.imageUrls())
        .map((img) => ({
          src: img,
          alt: `${commander.name} card art`,
        }))}
    >
      <div className="flex h-32 flex-col space-y-2">
        <Link
          href={commander.breakdownUrl()}
          className="text-xl font-bold underline decoration-transparent transition-colors group-hover:decoration-inherit"
        >
          {commander.name}
        </Link>

        <ColorIdentity identity={commander.colorId} />
      </div>
    </Card>
  );
}

async function renderCommanderCards(
  commanders: Connection<Commander>,
  filters: CommanderStatsFilters,
  display: ListStyle,
  sortBy: string,
): Promise<ReactNode> {
  return (
    <>
      {commanders.edges.map(({node}) => (
        <TopCommandersCard
          key={node.id}
          commander={node}
          filters={filters}
          display={display}
          secondaryStatistic={
            sortBy === 'CONVERSION' || sortBy === 'TOP_CUTS'
              ? 'topCuts'
              : 'count'
          }
        />
      ))}
    </>
  );
}

async function buildCommandersListState(
  commanders: Connection<Commander>,
  filters: CommanderStatsFilters,
  display: ListStyle,
  sortBy: string,
): Promise<ListContainerState> {
  const items = await renderCommanderCards(
    commanders,
    filters,
    display,
    sortBy,
  );
  return {
    items,
    hasNextPage: commanders.pageInfo.hasNextPage,
    endCursor: commanders.pageInfo.endCursor,
  };
}

function CommandersPageShell({
  display,
  filters,
  children,
}: PropsWithChildren<{display: ListStyle; filters: CommanderPageFilters}>) {
  const promo = homePagePromo();

  async function setListStyle(style: ListStyle) {
    'use server';

    const vc = await ViewerContext.forRequest();
    await vc.updateListStyle(style);
  }

  return (
    <>
      <Navigation searchResults={searchResults([SearchResultType.COMMANDER])} />

      <div className="mx-auto mt-8 w-full max-w-(--breakpoint-xl) px-8">
        <div className="flex w-full items-baseline gap-4">
          <h1 className="font-title mb-8 flex-1 text-5xl font-extrabold text-white">
            cEDH Metagame Breakdown
          </h1>

          <DisplayStyleToggle display={display} onChangeAction={setListStyle} />
        </div>

        <CommanderPageFilterMenu filters={filters} />
        {promo && <FirstPartyPromo promo={promo} />}
        {children}
      </div>
    </>
  );
}

const PAGE_SIZE = 48;

export default async function Page(props: PageProps<'/'>) {
  const vc = await ViewerContext.forRequest();

  const {
    timePeriod = TimePeriod.SIX_MONTHS,
    sortBy = CommandersSortBy.POPULARITY,
    minEntries = 20,
    minSize = 50,
    colorId = '',
  } = z
    .object({
      timePeriod: z.enum(TimePeriod).optional(),
      sortBy: z.enum(CommandersSortBy).optional(),
      minEntries: z.coerce.number().int().optional(),
      minSize: z.coerce.number().int().optional(),
      colorId: z.string().optional(),
    })
    .parse(await props.searchParams);

  const listStyle = vc.listStyle;
  const statsFilters: CommanderStatsFilters = {minSize, timePeriod, colorId};
  const filters = {minEntries, minSize, timePeriod, sortBy, colorId};

  // Server action to load more commanders
  async function loadCommanders(cursor?: string): Promise<ListContainerState> {
    'use server';

    const vc = await ViewerContext.forRequest();
    const commanders = await Commander.commanders(
      vc,
      PAGE_SIZE,
      cursor,
      minEntries,
      minSize,
      timePeriod,
      sortBy,
      colorId,
    );

    return buildCommandersListState(
      commanders,
      statsFilters,
      listStyle,
      sortBy,
    );
  }

  const initialState = await loadCommanders();

  return (
    <>
      <CommandersPageShell display={listStyle} filters={filters}>
        <ListContainer
          key={listStyle + JSON.stringify(filters)}
          initialState={initialState}
          loadMoreAction={loadCommanders}
          gridClassName={cn(
            'mx-auto grid w-full pb-4',
            listStyle === 'table'
              ? 'grid-cols-1 gap-2'
              : 'gap-4 md:grid-cols-2 xl:grid-cols-3',
          )}
          header={
            listStyle === 'table' ? (
              <div className="sticky top-[68px] hidden w-full grid-cols-[130px_minmax(350px,1fr)_100px_100px_100px_100px] items-center gap-x-2 overflow-x-hidden bg-[#514f86] p-4 text-sm text-white lg:grid">
                <div>Color</div>
                <div>Commander</div>
                <div>Entries</div>
                <div>Meta %</div>
                <div>Top Cuts</div>
                <div>Cnvr. %</div>
              </div>
            ) : undefined
          }
        />
      </CommandersPageShell>

      <Footer />
    </>
  );
}
