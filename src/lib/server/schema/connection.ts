import {toGlobalId} from 'graphql-relay';
import {ID} from 'grats';

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
