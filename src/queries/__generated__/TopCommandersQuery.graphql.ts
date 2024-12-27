/**
 * @generated SignedSource<<792c75d962e9c539e9be1184bb1b4e76>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type CommandersSortBy = "CONVERSION" | "POPULARITY" | "%future added value";
export type TimePeriod = "ALL_TIME" | "ONE_MONTH" | "ONE_YEAR" | "POST_BAN" | "SIX_MONTHS" | "THREE_MONTHS" | "%future added value";
export type TopCommandersQuery$variables = {
  colorId?: string | null | undefined;
  count?: number | null | undefined;
  cursor?: string | null | undefined;
  minEntries?: number | null | undefined;
  minTournamentSize?: number | null | undefined;
  sortBy?: CommandersSortBy | null | undefined;
  timePeriod?: TimePeriod | null | undefined;
};
export type TopCommandersQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"pages_topCommanders">;
};
export type TopCommandersQuery = {
  response: TopCommandersQuery$data;
  variables: TopCommandersQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "colorId"
  },
  {
    "defaultValue": 48,
    "kind": "LocalArgument",
    "name": "count"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "cursor"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "minEntries"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "minTournamentSize"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "sortBy"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "timePeriod"
  }
],
v1 = {
  "kind": "Variable",
  "name": "timePeriod",
  "variableName": "timePeriod"
},
v2 = [
  {
    "kind": "Variable",
    "name": "after",
    "variableName": "cursor"
  },
  {
    "kind": "Variable",
    "name": "colorId",
    "variableName": "colorId"
  },
  {
    "kind": "Variable",
    "name": "first",
    "variableName": "count"
  },
  {
    "kind": "Variable",
    "name": "minEntries",
    "variableName": "minEntries"
  },
  {
    "kind": "Variable",
    "name": "minTournamentSize",
    "variableName": "minTournamentSize"
  },
  {
    "kind": "Variable",
    "name": "sortBy",
    "variableName": "sortBy"
  },
  (v1/*: any*/)
],
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "TopCommandersQuery",
    "selections": [
      {
        "args": [
          {
            "kind": "Variable",
            "name": "count",
            "variableName": "count"
          },
          {
            "kind": "Variable",
            "name": "cursor",
            "variableName": "cursor"
          }
        ],
        "kind": "FragmentSpread",
        "name": "pages_topCommanders"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "TopCommandersQuery",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "QueryCommandersConnection",
        "kind": "LinkedField",
        "name": "commanders",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "QueryCommandersConnectionEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "Commander",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v3/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "name",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "colorId",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "breakdownUrl",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": [
                      {
                        "fields": [
                          {
                            "kind": "Variable",
                            "name": "minSize",
                            "variableName": "minTournamentSize"
                          },
                          (v1/*: any*/)
                        ],
                        "kind": "ObjectValue",
                        "name": "filters"
                      }
                    ],
                    "concreteType": "CommanderStats",
                    "kind": "LinkedField",
                    "name": "stats",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "conversionRate",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "topCuts",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "count",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "metaShare",
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Card",
                    "kind": "LinkedField",
                    "name": "cards",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "imageUrls",
                        "storageKey": null
                      },
                      (v3/*: any*/)
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "__typename",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "cursor",
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "PageInfo",
            "kind": "LinkedField",
            "name": "pageInfo",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "endCursor",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "hasNextPage",
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": (v2/*: any*/),
        "filters": [
          "timePeriod",
          "sortBy",
          "colorId",
          "minEntries",
          "minTournamentSize"
        ],
        "handle": "connection",
        "key": "pages__commanders",
        "kind": "LinkedHandle",
        "name": "commanders"
      }
    ]
  },
  "params": {
    "cacheID": "5ff9379fd35615befef7fb22ec8f0e00",
    "id": null,
    "metadata": {},
    "name": "TopCommandersQuery",
    "operationKind": "query",
    "text": "query TopCommandersQuery(\n  $colorId: String\n  $count: Int = 48\n  $cursor: String\n  $minEntries: Int\n  $minTournamentSize: Int\n  $sortBy: CommandersSortBy\n  $timePeriod: TimePeriod\n) {\n  ...pages_topCommanders_1G22uz\n}\n\nfragment pages_TopCommandersCard on Commander {\n  name\n  colorId\n  breakdownUrl\n  stats(filters: {timePeriod: $timePeriod, minSize: $minTournamentSize}) {\n    conversionRate\n    topCuts\n    count\n    metaShare\n  }\n  cards {\n    imageUrls\n    id\n  }\n}\n\nfragment pages_topCommanders_1G22uz on Query {\n  commanders(first: $count, after: $cursor, timePeriod: $timePeriod, sortBy: $sortBy, colorId: $colorId, minEntries: $minEntries, minTournamentSize: $minTournamentSize) {\n    edges {\n      node {\n        id\n        ...pages_TopCommandersCard\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "b5a6c24d9b40c399fa950a403034faa7";

export default node;
