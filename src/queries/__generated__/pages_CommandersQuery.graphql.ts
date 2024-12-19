/**
 * @generated SignedSource<<d0c85079328c1260c271d01741ad69f3>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type CommandersSortBy = "CONVERSION" | "POPULARITY" | "%future added value";
export type TimePeriod = "ALL_TIME" | "ONE_MONTH" | "ONE_YEAR" | "SIX_MONTHS" | "THREE_MONTHS" | "POST_BAN";
export type pages_CommandersQuery$variables = {
  colorId?: string | null | undefined;
  minEntries: number;
  minTournamentSize: number;
  sortBy: CommandersSortBy;
  timePeriod: TimePeriod;
};
export type pages_CommandersQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"pages_topCommanders">;
};
export type pages_CommandersQuery = {
  response: pages_CommandersQuery$data;
  variables: pages_CommandersQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "colorId"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "minEntries"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "minTournamentSize"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "sortBy"
},
v4 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "timePeriod"
},
v5 = {
  "kind": "Variable",
  "name": "timePeriod",
  "variableName": "timePeriod"
},
v6 = [
  {
    "kind": "Variable",
    "name": "colorId",
    "variableName": "colorId"
  },
  {
    "kind": "Literal",
    "name": "first",
    "value": 48
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
  (v5/*: any*/)
],
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/),
      (v3/*: any*/),
      (v4/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "pages_CommandersQuery",
    "selections": [
      {
        "args": null,
        "kind": "FragmentSpread",
        "name": "pages_topCommanders"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v4/*: any*/),
      (v3/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "pages_CommandersQuery",
    "selections": [
      {
        "alias": null,
        "args": (v6/*: any*/),
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
                  (v7/*: any*/),
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
                          (v5/*: any*/)
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
                      (v7/*: any*/)
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
        "args": (v6/*: any*/),
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
    "cacheID": "03321d5e5a74c869e88861867fe1f54f",
    "id": null,
    "metadata": {},
    "name": "pages_CommandersQuery",
    "operationKind": "query",
    "text": "query pages_CommandersQuery(\n  $timePeriod: TimePeriod!\n  $sortBy: CommandersSortBy!\n  $minEntries: Int!\n  $minTournamentSize: Int!\n  $colorId: String\n) {\n  ...pages_topCommanders\n}\n\nfragment pages_TopCommandersCard on Commander {\n  name\n  colorId\n  breakdownUrl\n  stats(filters: {timePeriod: $timePeriod}) {\n    conversionRate\n    topCuts\n    count\n    metaShare\n  }\n  cards {\n    imageUrls\n    id\n  }\n}\n\nfragment pages_topCommanders on Query {\n  commanders(first: 48, timePeriod: $timePeriod, sortBy: $sortBy, colorId: $colorId, minEntries: $minEntries, minTournamentSize: $minTournamentSize) {\n    edges {\n      node {\n        id\n        ...pages_TopCommandersCard\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "c1fa5916a049524edba4b690aacf4c50";

export default node;
