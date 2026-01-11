export interface GraphQLNode {
  __typename: string;
  id: string | number;
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
