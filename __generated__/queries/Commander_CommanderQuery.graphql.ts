/**
 * @generated SignedSource<<f4769fa80b84d0c7ddada147525d95f5>>
 * @relayHash 9ae62420274820b0e7749bc173d31327
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 9ae62420274820b0e7749bc173d31327

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type EntriesSortBy = "NEW" | "TOP" | "%future added value";
export type TimePeriod = "ALL_TIME" | "ONE_MONTH" | "ONE_YEAR" | "POST_BAN" | "SIX_MONTHS" | "THREE_MONTHS" | "%future added value";
export type Commander_CommanderQuery$variables = {
  cardName?: string | null | undefined;
  commander: string;
  maxStanding?: number | null | undefined;
  minEventSize: number;
  showCardOptions: boolean;
  showEntries: boolean;
  showStaples: boolean;
  sortBy: EntriesSortBy;
  timePeriod: TimePeriod;
};
export type Commander_CommanderQuery$data = {
  readonly commander: {
    readonly cardDetailOptions?: ReadonlyArray<{
      readonly id: string;
      readonly name: string;
    }>;
    readonly entries?: {
      readonly " $fragmentSpreads": FragmentRefs<"Commander_entries">;
    } | null | undefined;
    readonly staples?: {
      readonly " $fragmentSpreads": FragmentRefs<"Commander_CommanderStaples">;
    } | null | undefined;
    readonly " $fragmentSpreads": FragmentRefs<"Commander_CardTab" | "Commander_CommanderPageShell" | "Commander_CommanderStats">;
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
  "name": "showCardOptions"
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
  "kind": "Variable",
  "name": "cardName",
  "variableName": "cardName"
},
v11 = {
  "kind": "Variable",
  "name": "maxStanding",
  "variableName": "maxStanding"
},
v12 = {
  "kind": "Variable",
  "name": "minEventSize",
  "variableName": "minEventSize"
},
v13 = {
  "kind": "Variable",
  "name": "sortBy",
  "variableName": "sortBy"
},
v14 = {
  "kind": "Variable",
  "name": "timePeriod",
  "variableName": "timePeriod"
},
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v17 = {
  "alias": "cardDetailOptions",
  "args": null,
  "concreteType": "Card",
  "kind": "LinkedField",
  "name": "staples",
  "plural": true,
  "selections": [
    (v15/*: any*/),
    (v16/*: any*/)
  ],
  "storageKey": null
},
v18 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "colorId",
  "storageKey": null
},
v19 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "imageUrls",
  "storageKey": null
},
v20 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "scryfallUrl",
  "storageKey": null
},
v21 = {
  "fields": [
    (v11/*: any*/),
    (v12/*: any*/),
    (v14/*: any*/)
  ],
  "kind": "ObjectValue",
  "name": "filters"
},
v22 = {
  "kind": "Literal",
  "name": "first",
  "value": 48
},
v23 = [
  (v21/*: any*/),
  (v22/*: any*/),
  (v13/*: any*/)
],
v24 = [
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
          (v15/*: any*/),
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
              (v16/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "isKnownCheater",
                "storageKey": null
              },
              (v15/*: any*/)
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
              (v16/*: any*/),
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
              (v15/*: any*/)
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
v25 = [
  (v22/*: any*/)
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
    "name": "Commander_CommanderQuery",
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
            "args": null,
            "kind": "FragmentSpread",
            "name": "Commander_CommanderPageShell"
          },
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "Commander_CommanderStats"
          },
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
                      "name": "Commander_CommanderStaples"
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
                      "name": "Commander_entries"
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
            "condition": "showCardOptions",
            "kind": "Condition",
            "passingValue": true,
            "selections": [
              {
                "args": [
                  (v10/*: any*/),
                  (v11/*: any*/),
                  (v12/*: any*/),
                  (v13/*: any*/),
                  (v14/*: any*/)
                ],
                "kind": "FragmentSpread",
                "name": "Commander_CardTab"
              },
              (v17/*: any*/)
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
      (v7/*: any*/),
      (v3/*: any*/),
      (v2/*: any*/),
      (v8/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "Commander_CommanderQuery",
    "selections": [
      {
        "alias": null,
        "args": (v9/*: any*/),
        "concreteType": "Commander",
        "kind": "LinkedField",
        "name": "commander",
        "plural": false,
        "selections": [
          (v16/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "breakdownUrl",
            "storageKey": null
          },
          (v18/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Card",
            "kind": "LinkedField",
            "name": "cards",
            "plural": true,
            "selections": [
              (v19/*: any*/),
              (v15/*: any*/)
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "FirstPartyPromo",
            "kind": "LinkedField",
            "name": "promo",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "title",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "description",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "buttonText",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "backgroundImageUrl",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "imageUrl",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "href",
                "storageKey": null
              }
            ],
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
                    "variableName": "minEventSize"
                  },
                  (v14/*: any*/)
                ],
                "kind": "ObjectValue",
                "name": "filters"
              }
            ],
            "concreteType": "CommanderCalculatedStats",
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
            "storageKey": null
          },
          (v15/*: any*/),
          {
            "condition": "showStaples",
            "kind": "Condition",
            "passingValue": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "Card",
                "kind": "LinkedField",
                "name": "staples",
                "plural": true,
                "selections": [
                  (v15/*: any*/),
                  (v16/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "type",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "cmc",
                    "storageKey": null
                  },
                  (v18/*: any*/),
                  (v19/*: any*/),
                  (v20/*: any*/),
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
                "args": (v23/*: any*/),
                "concreteType": "EntryConnection",
                "kind": "LinkedField",
                "name": "entries",
                "plural": false,
                "selections": (v24/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": (v23/*: any*/),
                "filters": [
                  "sortBy",
                  "filters"
                ],
                "handle": "connection",
                "key": "Commander_entries",
                "kind": "LinkedHandle",
                "name": "entries"
              }
            ]
          },
          {
            "condition": "showCardOptions",
            "kind": "Condition",
            "passingValue": true,
            "selections": [
              {
                "alias": null,
                "args": [
                  (v10/*: any*/),
                  (v21/*: any*/),
                  (v13/*: any*/)
                ],
                "concreteType": "CommanderCardDetails",
                "kind": "LinkedField",
                "name": "cardDetails",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Card",
                    "kind": "LinkedField",
                    "name": "card",
                    "plural": false,
                    "selections": [
                      (v16/*: any*/),
                      (v20/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "cardPreviewImageUrl",
                        "storageKey": null
                      },
                      (v15/*: any*/)
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "CommanderCardWinRatePoint",
                    "kind": "LinkedField",
                    "name": "winRateSeries",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "periodStart",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "winRateWithCard",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "winRateWithoutCard",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "withCount",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "withoutCount",
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": (v25/*: any*/),
                    "concreteType": "EntryConnection",
                    "kind": "LinkedField",
                    "name": "entries",
                    "plural": false,
                    "selections": (v24/*: any*/),
                    "storageKey": "entries(first:48)"
                  },
                  {
                    "alias": null,
                    "args": (v25/*: any*/),
                    "filters": null,
                    "handle": "connection",
                    "key": "Commander_cardEntries__entries",
                    "kind": "LinkedHandle",
                    "name": "entries"
                  }
                ],
                "storageKey": null
              },
              (v17/*: any*/)
            ]
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "9ae62420274820b0e7749bc173d31327",
    "metadata": {},
    "name": "Commander_CommanderQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "ca3062b4ed0f265225bf78df4ca0a78c";

import { PreloadableQueryRegistry } from 'relay-runtime';
PreloadableQueryRegistry.set(node.params.id, node);

export default node;
