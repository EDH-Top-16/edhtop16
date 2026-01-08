'use client';

import {
  useParams,
  useRouter,
  useSearchParams,
  useSelectedLayoutSegment,
} from 'next/navigation';
import {Tab, TabList} from './tabs';

export function CommanderTabNavigation() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = useSelectedLayoutSegment();
  const params = useParams<{commander: string; card?: string}>();

  const commanderName = decodeURIComponent(params.commander);
  const cardName = params.card ? decodeURIComponent(params.card) : undefined;

  function pushRoute(
    nextTab:
      | {tab: 'entries'}
      | {tab: 'staples'}
      | {tab: 'card'; cardName: string},
  ) {
    let nextRoute = `/commander/${encodeURIComponent(commanderName)}`;
    if (nextTab.tab === 'staples') {
      nextRoute += '/staples';
    } else if (nextTab.tab === 'card') {
      nextRoute += `/staples/${encodeURIComponent(nextTab.cardName)}`;
    }

    router.push(`${nextRoute}?${searchParams}`);
  }

  return (
    <TabList
      className="mx-auto max-w-(--breakpoint-md)"
      border={tab === 'staples' || tab === 'card'}
    >
      <Tab
        selected={tab === 'entries' || !tab}
        onClick={() => {
          pushRoute({tab: 'entries'});
        }}
      >
        Tournament Entries
      </Tab>

      <Tab
        selected={tab === 'staples'}
        onClick={() => {
          pushRoute({tab: 'staples'});
        }}
      >
        Staples
      </Tab>

      {cardName && tab === 'card' && (
        <Tab
          selected={tab === 'card'}
          onClick={() => {
            pushRoute({
              tab: 'card',
              cardName,
            });
          }}
        >
          {cardName}
        </Tab>
      )}
    </TabList>
  );
}
