/**
 * @generated SignedSource<<a2d3ec6e4a5ee31deeab0e90fcedd563>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type TimePeriod = "ALL_TIME" | "ONE_MONTH" | "ONE_YEAR" | "POST_BAN" | "SIX_MONTHS" | "THREE_MONTHS" | "%future added value";
export type TournamentSortBy = "DATE" | "PLAYERS" | "%future added value";
export type tournaments_TournamentsQuery$variables = {
  minSize: number;
  sortBy: TournamentSortBy;
  timePeriod: TimePeriod;
};
export type tournaments_TournamentsQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"tournaments_Tournaments">;
};
export type tournaments_TournamentsQuery = {
  response: tournaments_TournamentsQuery$data;
  variables: tournaments_TournamentsQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "minSize"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "sortBy"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "timePeriod"
},
v3 = [
  {
    "fields": [
      {
        "kind": "Variable",
        "name": "minSize",
        "variableName": "minSize"
      },
      {
        "kind": "Variable",
        "name": "timePeriod",
        "variableName": "timePeriod"
      }
    ],
    "kind": "ObjectValue",
    "name": "filters"
  },
  {
    "kind": "Literal",
    "name": "first",
    "value": 100
  },
  {
    "kind": "Variable",
    "name": "sortBy",
    "variableName": "sortBy"
  }
],
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "tournaments_TournamentsQuery",
    "selections": [
      {
        "args": null,
        "kind": "FragmentSpread",
        "name": "tournaments_Tournaments"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v2/*: any*/),
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "tournaments_TournamentsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": "QueryTournamentsConnection",
        "kind": "LinkedField",
        "name": "tournaments",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "QueryTournamentsConnectionEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "Tournament",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v4/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "TID",
                    "storageKey": null
                  },
                  (v5/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "size",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "tournamentDate",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": [
                      {
                        "kind": "Literal",
                        "name": "maxStanding",
                        "value": 1
                      }
                    ],
                    "concreteType": "Entry",
                    "kind": "LinkedField",
                    "name": "entries",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Player",
                        "kind": "LinkedField",
                        "name": "player",
                        "plural": false,
                        "selections": [
                          (v5/*: any*/),
                          (v4/*: any*/)
                        ],
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Commander",
                        "kind": "LinkedField",
                        "name": "commander",
                        "plural": false,
                        "selections": [
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
                              (v4/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v4/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v4/*: any*/)
                    ],
                    "storageKey": "entries(maxStanding:1)"
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
        "args": (v3/*: any*/),
        "filters": [
          "filters",
          "sortBy"
        ],
        "handle": "connection",
        "key": "tournaments__tournaments",
        "kind": "LinkedHandle",
        "name": "tournaments"
      }
    ]
  },
  "params": {
    "cacheID": "3a51f41e3bf477628d97c7d880dbc6fc",
    "id": null,
    "metadata": {},
    "name": "tournaments_TournamentsQuery",
    "operationKind": "query",
    "text": "query tournaments_TournamentsQuery(\n  $timePeriod: TimePeriod!\n  $sortBy: TournamentSortBy!\n  $minSize: Int!\n) {\n  ...tournaments_Tournaments\n}\n\nfragment tournaments_TournamentCard on Tournament {\n  TID\n  name\n  size\n  tournamentDate\n  entries(maxStanding: 1) {\n    player {\n      name\n      id\n    }\n    commander {\n      cards {\n        imageUrls\n        id\n      }\n      id\n    }\n    id\n  }\n}\n\nfragment tournaments_Tournaments on Query {\n  tournaments(first: 100, filters: {timePeriod: $timePeriod, minSize: $minSize}, sortBy: $sortBy) {\n    edges {\n      node {\n        id\n        ...tournaments_TournamentCard\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "7ea75e1966ab0b4c32500aa3341ec813";

export default node;
