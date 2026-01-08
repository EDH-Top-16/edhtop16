'use client';

import {
  useParams,
  useRouter,
  useSearchParams,
  useSelectedLayoutSegment,
} from 'next/navigation';
import {Tab, TabList} from './tabs';

export function TournamentTabNavigation() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tab = useSelectedLayoutSegment();
  const params = useParams<{
    tid: string;
    commander?: string;
  }>();

  const tid = params.tid;
  const commanderName = params.commander
    ? decodeURIComponent(params.commander)
    : undefined;

  function pushRoute(
    nextTab:
      | {tab: 'entries'}
      | {tab: 'breakdown'}
      | {tab: 'commander'; commanderName: string},
  ) {
    let nextRoute = `/tournament/${encodeURIComponent(tid)}`;
    if (nextTab.tab === 'breakdown') {
      nextRoute += '/breakdown';
    } else if (nextTab.tab === 'commander') {
      nextRoute += `/commander/${encodeURIComponent(nextTab.commanderName)}`;
    }

    router.push(`${nextRoute}?${searchParams}`);
  }

  return (
    <TabList className="mx-auto max-w-(--breakpoint-md)">
      <Tab
        id="entries"
        selected={tab === 'entries' || !tab}
        onClick={() => {
          pushRoute({tab: 'entries'});
        }}
      >
        Standings
      </Tab>

      <Tab
        id="breakdown"
        selected={tab === 'breakdown'}
        onClick={() => {
          pushRoute({tab: 'breakdown'});
        }}
      >
        Metagame Breakdown
      </Tab>

      {commanderName != null && (
        <Tab id="commander" selected={tab === 'commander'}>
          {commanderName}
        </Tab>
      )}
    </TabList>
  );
}
