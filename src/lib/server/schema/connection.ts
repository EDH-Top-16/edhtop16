import {toGlobalId, fromGlobalId} from 'graphql-relay';
import {ID} from 'grats';
import {Commander, CommanderLoader} from './commander';
import {Entry, EntryLoader} from './entry';
import {Tournament, TournamentLoader} from './tournament';
import {Card, CardLoader} from './card';
import {Player, PlayerLoader} from './player';

/** @gqlInterface Node */
export interface GraphQLNode {
  __typename: string;
  id: string | number;
}

/**
 * @gqlField
 * @killsParentOnException
 */
export function id(node: GraphQLNode): ID {
  return toGlobalId(node.__typename, node.id);
}

/** @gqlType */
export type Connection<T> = {
  /** @gqlField */
  edges: Edge<T>[];
  /** @gqlField */
  pageInfo: PageInfo;
};

/** @gqlType */
export type Edge<T> = {
  /** @gqlField */
  node: T;
  /** @gqlField */
  cursor: string;
};

/** @gqlType */
export type PageInfo = {
  /** @gqlField */
  startCursor: string | null;
  /** @gqlField */
  endCursor: string | null;
  /** @gqlField */
  hasNextPage: boolean;
  /** @gqlField */
  hasPreviousPage: boolean;
};

/** @gqlQueryField */
export async function node(
  id: ID,
  commanderLoader: CommanderLoader,
  entryLoader: EntryLoader,
  tournamentLoader: TournamentLoader,
  cardLoader: CardLoader,
  playerLoader: PlayerLoader,
): Promise<GraphQLNode | null> {
  const {type, id: rawId} = fromGlobalId(id);
  const numericId = Number(rawId);

  switch (type) {
    case 'Commander':
      return await commanderLoader.load(numericId);
    case 'Entry':
      return await entryLoader.load(numericId);
    case 'Tournament':
      return await tournamentLoader.load(numericId);
    case 'Card':
      return await cardLoader.load(numericId);
    case 'Player':
      return await playerLoader.load(numericId);
    default:
      return null;
  }
}
