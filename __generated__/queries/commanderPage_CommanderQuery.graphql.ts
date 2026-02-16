/**
 * @generated SignedSource<<d2afe129fa20149732e35d6b472f6dfc>>
 * @relayHash 72e75eb82ccccbb2d3f572cd43cbe7d3
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 72e75eb82ccccbb2d3f572cd43cbe7d3

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type EntriesSortBy = "NEW" | "TOP" | "%future added value";
export type TimePeriod = "ALL_TIME" | "ONE_MONTH" | "ONE_YEAR" | "POST_BAN" | "SIX_MONTHS" | "THREE_MONTHS" | "%future added value";
export type commanderPage_CommanderQuery$variables = {
  cardName?: string | null | undefined;
  commander: string;
  maxStanding?: number | null | undefined;
  minEventSize: number;
  showCardDetail: boolean;
  showEntries: boolean;
  showStaples: boolean;
  sortBy: EntriesSortBy;
  timePeriod: TimePeriod;
};
export type commanderPage_CommanderQuery$data = {
  readonly commander: {
    readonly cardDetail?: {
      readonly " $fragmentSpreads": FragmentRefs<"commanderPage_CardDetail">;
    } | null | undefined;
    readonly entries?: {
      readonly " $fragmentSpreads": FragmentRefs<"commanderPage_entries">;
    } | null | undefined;
    readonly staples?: {
      readonly " $fragmentSpreads": FragmentRefs<"commanderPage_CommanderStaples">;
    } | null | undefined;
  };
};
export type commanderPage_CommanderQuery = {
  response: commanderPage_CommanderQuery$data;
  variables: commanderPage_CommanderQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "cardName"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "commander"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "maxStanding"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "minEventSize"
},
v4 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "showCardDetail"
},
v5 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "showEntries"
},
v6 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "showStaples"
},
v7 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "sortBy"
},
v8 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "timePeriod"
},
v9 = [
  {
    "kind": "Variable",
    "name": "name",
    "variableName": "commander"
  }
],
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "type",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "scryfallUrl",
  "storageKey": null
},
v14 = {
  "kind": "Literal",
  "name": "first",
  "value": 48
},
v15 = {
  "kind": "Variable",
  "name": "sortBy",
  "variableName": "sortBy"
},
v16 = [
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
  (v14/*: any*/),
  (v15/*: any*/)
],
v17 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "EntryEdge",
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
          (v10/*: any*/),
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
              (v11/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "team",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "isKnownCheater",
                "storageKey": null
              },
              (v10/*: any*/)
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
              (v11/*: any*/),
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
                "args": null,
                "kind": "ScalarField",
                "name": "TID",
                "storageKey": null
              },
              (v10/*: any*/)
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
v18 = {
  "kind": "Variable",
  "name": "cardName",
  "variableName": "cardName"
},
v19 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "totalEntries",
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
    "name": "conversionRate",
    "storageKey": null
  }
],
v20 = [
  (v18/*: any*/),
  (v14/*: any*/),
  (v15/*: any*/)
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/),
      (v3/*: any*/),
      (v4/*: any*/),
      (v5/*: any*/),
      (v6/*: any*/),
      (v7/*: any*/),
      (v8/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": {
      "throwOnFieldError": true
    },
    "name": "commanderPage_CommanderQuery",
    "selections": [
      {
        "alias": null,
        "args": (v9/*: any*/),
        "concreteType": "Commander",
        "kind": "LinkedField",
        "name": "commander",
        "plural": false,
        "selections": [
          {
            "condition": "showStaples",
            "kind": "Condition",
            "passingValue": true,
            "selections": [
              {
                "fragment": {
                  "kind": "InlineFragment",
                  "selections": [
                    {
                      "args": null,
                      "kind": "FragmentSpread",
                      "name": "commanderPage_CommanderStaples"
                    }
                  ],
                  "type": "Commander",
                  "abstractKey": null
                },
                "kind": "AliasedInlineFragmentSpread",
                "name": "staples"
              }
            ]
          },
          {
            "condition": "showEntries",
            "kind": "Condition",
            "passingValue": true,
            "selections": [
              {
                "fragment": {
                  "kind": "InlineFragment",
                  "selections": [
                    {
                      "args": null,
                      "kind": "FragmentSpread",
                      "name": "commanderPage_entries"
                    }
                  ],
                  "type": "Commander",
                  "abstractKey": null
                },
                "kind": "AliasedInlineFragmentSpread",
                "name": "entries"
              }
            ]
          },
          {
            "condition": "showCardDetail",
            "kind": "Condition",
            "passingValue": true,
            "selections": [
              {
                "fragment": {
                  "kind": "InlineFragment",
                  "selections": [
                    {
                      "args": null,
                      "kind": "FragmentSpread",
                      "name": "commanderPage_CardDetail"
                    }
                  ],
                  "type": "Commander",
                  "abstractKey": null
                },
                "kind": "AliasedInlineFragmentSpread",
                "name": "cardDetail"
              }
            ]
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
      (v1/*: any*/),
      (v6/*: any*/),
      (v5/*: any*/),
      (v4/*: any*/),
      (v0/*: any*/),
      (v7/*: any*/),
      (v3/*: any*/),
      (v2/*: any*/),
      (v8/*: any*/)
    ],
    "kind": "Operation",
    "name": "commanderPage_CommanderQuery",
    "selections": [
      {
        "alias": null,
        "args": (v9/*: any*/),
        "concreteType": "Commander",
        "kind": "LinkedField",
        "name": "commander",
        "plural": false,
        "selections": [
          (v10/*: any*/),
          {
            "condition": "showStaples",
            "kind": "Condition",
            "passingValue": true,
            "selections": [
              (v11/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Card",
                "kind": "LinkedField",
                "name": "staples",
                "plural": true,
                "selections": [
                  (v10/*: any*/),
                  (v11/*: any*/),
                  (v12/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "manaCost",
                    "storageKey": null
                  },
                  (v13/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "playRateLastYear",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ]
          },
          {
            "condition": "showEntries",
            "kind": "Condition",
            "passingValue": true,
            "selections": [
              {
                "alias": null,
                "args": (v16/*: any*/),
                "concreteType": "EntryConnection",
                "kind": "LinkedField",
                "name": "entries",
                "plural": false,
                "selections": (v17/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": (v16/*: any*/),
                "filters": [
                  "sortBy",
                  "filters"
                ],
                "handle": "connection",
                "key": "commanderPage_entries",
                "kind": "LinkedHandle",
                "name": "entries"
              }
            ]
          },
          {
            "condition": "showCardDetail",
            "kind": "Condition",
            "passingValue": true,
            "selections": [
              (v11/*: any*/),
              {
                "alias": null,
                "args": [
                  (v18/*: any*/)
                ],
                "concreteType": "Card",
                "kind": "LinkedField",
                "name": "cardDetail",
                "plural": false,
                "selections": [
                  (v11/*: any*/),
                  (v12/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "cmc",
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
                    "name": "imageUrls",
                    "storageKey": null
                  },
                  (v13/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "cardPreviewImageUrl",
                    "storageKey": null
                  },
                  (v10/*: any*/)
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": [
                  (v18/*: any*/),
                  {
                    "kind": "Literal",
                    "name": "timePeriod",
                    "value": "THREE_MONTHS"
                  }
                ],
                "concreteType": "CommanderCardWinrateStats",
                "kind": "LinkedField",
                "name": "cardWinrateStats",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "CommanderCardStats",
                    "kind": "LinkedField",
                    "name": "withCard",
                    "plural": false,
                    "selections": (v19/*: any*/),
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "CommanderCardStats",
                    "kind": "LinkedField",
                    "name": "withoutCard",
                    "plural": false,
                    "selections": (v19/*: any*/),
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": (v20/*: any*/),
                "concreteType": "EntryConnection",
                "kind": "LinkedField",
                "name": "cardEntries",
                "plural": false,
                "selections": (v17/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": (v20/*: any*/),
                "filters": [
                  "cardName",
                  "sortBy"
                ],
                "handle": "connection",
                "key": "commanderPage_cardEntries",
                "kind": "LinkedHandle",
                "name": "cardEntries"
              }
            ]
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "72e75eb82ccccbb2d3f572cd43cbe7d3",
    "metadata": {},
    "name": "commanderPage_CommanderQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "b6c2dae8d6e30eea668eb9bfe82df6b3";

import { PreloadableQueryRegistry } from 'relay-runtime';
PreloadableQueryRegistry.set(node.params.id, node);

export default node;
