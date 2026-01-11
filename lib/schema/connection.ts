import {toGlobalId} from 'graphql-relay';
import {ID} from 'grats';

export interface GraphQLNode {
  __typename: string;
  id: string | number;
}

export function id(node: GraphQLNode): ID {
  return toGlobalId(node.__typename, node.id);
}

export type Connection<T> = {
  edges: Edge<T>[];
  pageInfo: PageInfo;
};

export type Edge<T> = {
  node: T;
  cursor: string;
};

export type PageInfo = {
  startCursor: string | null;
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};
