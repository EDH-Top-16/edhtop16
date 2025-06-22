import { useRouter } from "next/router";
import { Suspense } from "react";
import {
  useLazyLoadQuery,
  usePaginationFragment,
  usePreloadedQuery,
} from "react-relay";
import { RelayProps, withRelay } from "relay-nextjs";
import { graphql } from "relay-runtime";
import { CommanderPageShell } from ".";
import { Edhtop16Fallback, LoadingIcon } from "../../../components/fallback";
import { getClientEnvironment } from "../../../lib/client/relay_client_environment";
import { CommanderStapleCardsQuery } from "../../../queries/__generated__/CommanderStapleCardsQuery.graphql";
import { staples_cards$key } from "../../../queries/__generated__/staples_cards.graphql";
import { staples_CommanderStaplesPageFallbackQuery } from "../../../queries/__generated__/staples_CommanderStaplesPageFallbackQuery.graphql";
import { staples_CommanderStaplesQuery } from "../../../queries/__generated__/staples_CommanderStaplesQuery.graphql";
import { Footer } from "../../../components/footer";

function StapleCardsList(props: { commander: staples_cards$key }) {
  const { data } = usePaginationFragment<
    CommanderStapleCardsQuery,
    staples_cards$key
  >(
    graphql`
      fragment staples_cards on Commander
      @argumentDefinitions(
        cursor: { type: "String" }
        count: { type: "Int", defaultValue: 58 }
      )
      @refetchable(queryName: "CommanderStapleCardsQuery") {
        staples(first: $count, after: $cursor)
          @connection(key: "Staples__staples") {
          edges {
            node {
              id
              name
              colorId
              cardPreviewImageUrl
              scryfallUrl
            }
          }
        }
      }
    `,
    props.commander,
  );

  return (
    <div className="mx-auto flex grid w-full max-w-(--breakpoint-xl) grid-cols-1 gap-4 p-6 md:grid-cols-2 lg:grid-cols-3">
      {data.staples.edges.map(({ node }) => {
        return (
          <div key={node.id} className="flex flex-col items-center">
            <a
              className="text-white"
              href={node.scryfallUrl}
              target="_blank"
              rel="noopener norefferer"
            >
              {node.cardPreviewImageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  className="w-48"
                  alt={node.name}
                  src={node.cardPreviewImageUrl}
                />
              )}

              <p className="text-center underline">{node.name}</p>
            </a>
          </div>
        );
      })}
    </div>
  );
}

const CommanderStaplesQuery = graphql`
  query staples_CommanderStaplesQuery(
    $commander: String!
    $timePeriod: TimePeriod!
    $minEventSize: Int!
  ) {
    commander(name: $commander) {
      ...Commander_CommanderPageShell
      ...staples_cards
    }
  }
`;

function CommanderStaplesPage({
  preloadedQuery,
}: RelayProps<{}, staples_CommanderStaplesQuery>) {
  const { commander } = usePreloadedQuery(
    CommanderStaplesQuery,
    preloadedQuery,
  );

  return (
    <CommanderPageShell commander={commander}>
      <StapleCardsList commander={commander} />

      <Footer />
    </CommanderPageShell>
  );
}

function CommanderStaplesPageFallback() {
  const router = useRouter();

  const { commander } =
    useLazyLoadQuery<staples_CommanderStaplesPageFallbackQuery>(
      graphql`
        query staples_CommanderStaplesPageFallbackQuery(
          $commander: String!
          $timePeriod: TimePeriod!
          $minEventSize: Int!
        ) {
          commander(name: $commander) {
            ...Commander_CommanderPageShell
          }
        }
      `,
      {
        commander: router.query.commander as string,
        timePeriod: "ONE_YEAR",
        minEventSize: 0,
      },
      { fetchPolicy: "store-or-network" },
    );

  return (
    <CommanderPageShell commander={commander} disableNavigation>
      <LoadingIcon />
    </CommanderPageShell>
  );
}

export default withRelay(CommanderStaplesPage, CommanderStaplesQuery, {
  fallback: (
    <Suspense fallback={<Edhtop16Fallback />}>
      <CommanderStaplesPageFallback />
    </Suspense>
  ),
  createClientEnvironment: () => getClientEnvironment()!,
  createServerEnvironment: async () => {
    const { createServerEnvironment } = await import(
      "../../../lib/server/relay_server_environment"
    );

    return createServerEnvironment();
  },
  variablesFromContext: (ctx) => {
    return {
      commander: ctx.query.commander as string,
      timePeriod: "ONE_YEAR" as const,
      minEventSize: 0,
    };
  },
});
