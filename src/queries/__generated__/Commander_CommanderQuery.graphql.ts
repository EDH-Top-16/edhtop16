/**
 * @generated SignedSource<<66513002300bb8145ec5e7e0d47a9422>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type EntriesSortBy = "NEW" | "TOP" | "%future added value";
export type Commander_CommanderQuery$variables = {
  commander: string;
  maxStanding?: number | null | undefined;
  minEventSize: number;
  sortBy: EntriesSortBy;
};
export type Commander_CommanderQuery$data = {
  readonly commander: {
    readonly " $fragmentSpreads": FragmentRefs<"Commander_CommanderPageShell" | "Commander_entries">;
  };
};
export type Commander_CommanderQuery = {
  response: Commander_CommanderQuery$data;
  variables: Commander_CommanderQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "commander"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "maxStanding"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "minEventSize"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "sortBy"
},
v4 = [
  {
    "kind": "Variable",
    "name": "name",
    "variableName": "commander"
  }
],
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v7 = [
  {
    "fields": [
      {
        "kind": "Variable",
        "name": "maxStanding",
        "variableName": "maxStanding"
      },
      {
        "kind": "Variable",
        "name": "minEventSize",
        "variableName": "minEventSize"
      }
    ],
    "kind": "ObjectValue",
    "name": "filters"
  },
  {
    "kind": "Literal",
    "name": "first",
    "value": 48
  },
  {
    "kind": "Variable",
    "name": "sortBy",
    "variableName": "sortBy"
  }
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/),
      (v3/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "Commander_CommanderQuery",
    "selections": [
      {
        "alias": null,
        "args": (v4/*: any*/),
        "concreteType": "Commander",
        "kind": "LinkedField",
        "name": "commander",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "Commander_CommanderPageShell"
          },
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "Commander_entries"
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v3/*: any*/),
      (v2/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Operation",
    "name": "Commander_CommanderQuery",
    "selections": [
      {
        "alias": null,
        "args": (v4/*: any*/),
        "concreteType": "Commander",
        "kind": "LinkedField",
        "name": "commander",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "breakdownUrl",
            "storageKey": null
          },
          (v5/*: any*/),
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
              (v6/*: any*/)
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": [
              {
                "kind": "Literal",
                "name": "filters",
                "value": {
                  "timePeriod": "SIX_MONTHS"
                }
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
                "name": "metaShare",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "count",
                "storageKey": null
              }
            ],
            "storageKey": "stats(filters:{\"timePeriod\":\"SIX_MONTHS\"})"
          },
          {
            "alias": null,
            "args": (v7/*: any*/),
            "concreteType": "CommanderEntriesConnection",
            "kind": "LinkedField",
            "name": "entries",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "CommanderEntriesConnectionEdge",
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Entry",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      (v6/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "standing",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "wins",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "losses",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "draws",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "decklist",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Player",
                        "kind": "LinkedField",
                        "name": "player",
                        "plural": false,
                        "selections": [
                          (v5/*: any*/),
                          (v6/*: any*/)
                        ],
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Tournament",
                        "kind": "LinkedField",
                        "name": "tournament",
                        "plural": false,
                        "selections": [
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
                          (v6/*: any*/)
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
            "args": (v7/*: any*/),
            "filters": [
              "sortBy",
              "filters"
            ],
            "handle": "connection",
            "key": "Commander_entries",
            "kind": "LinkedHandle",
            "name": "entries"
          },
          (v6/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "2e70d4ad2d54853fbb4e3c5ed19a4771",
    "id": null,
    "metadata": {},
    "name": "Commander_CommanderQuery",
    "operationKind": "query",
    "text": "query Commander_CommanderQuery(\n  $commander: String!\n  $sortBy: EntriesSortBy!\n  $minEventSize: Int!\n  $maxStanding: Int\n) {\n  commander(name: $commander) {\n    ...Commander_CommanderPageShell\n    ...Commander_entries\n    id\n  }\n}\n\nfragment Commander_CommanderBanner on Commander {\n  name\n  colorId\n  cards {\n    imageUrls\n    id\n  }\n  stats(filters: {timePeriod: SIX_MONTHS}) {\n    conversionRate\n    metaShare\n    count\n  }\n}\n\nfragment Commander_CommanderMeta on Commander {\n  name\n}\n\nfragment Commander_CommanderPageShell on Commander {\n  breakdownUrl\n  ...Commander_CommanderBanner\n  ...Commander_CommanderMeta\n}\n\nfragment Commander_EntryCard on Entry {\n  standing\n  wins\n  losses\n  draws\n  decklist\n  player {\n    name\n    id\n  }\n  tournament {\n    name\n    size\n    tournamentDate\n    id\n  }\n}\n\nfragment Commander_entries on Commander {\n  entries(first: 48, sortBy: $sortBy, filters: {minEventSize: $minEventSize, maxStanding: $maxStanding}) {\n    edges {\n      node {\n        id\n        ...Commander_EntryCard\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n  id\n}\n"
  }
};
})();

(node as any).hash = "62443f235644239a92d5f77b7b5996a5";

export default node;
