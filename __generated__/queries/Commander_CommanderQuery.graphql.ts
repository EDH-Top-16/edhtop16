/**
 * @generated SignedSource<<9745cb9e54b66303f0f44076a1244bef>>
 * @relayHash ad8859e838edd29f99ce513dae32fc1a
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID ad8859e838edd29f99ce513dae32fc1a

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type EntriesSortBy = "NEW" | "TOP" | "%future added value";
export type TimePeriod = "ALL_TIME" | "ONE_MONTH" | "ONE_YEAR" | "POST_BAN" | "SIX_MONTHS" | "THREE_MONTHS" | "%future added value";
export type Commander_CommanderQuery$variables = {
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
export type Commander_CommanderQuery$data = {
  readonly commander: {
    readonly cardDetail?: {
      readonly " $fragmentSpreads": FragmentRefs<"Commander_CardDetail">;
    } | null | undefined;
    readonly entries?: {
      readonly " $fragmentSpreads": FragmentRefs<"Commander_entries">;
    } | null | undefined;
    readonly staples?: {
      readonly " $fragmentSpreads": FragmentRefs<"Commander_CommanderStaples">;
    } | null | undefined;
    readonly " $fragmentSpreads": FragmentRefs<"Commander_CommanderPageShell" | "Commander_CommanderStats">;
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
  "name": "name",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "colorId",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "imageUrls",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
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
  "name": "conversionRate",
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "type",
  "storageKey": null
},
v17 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "cmc",
  "storageKey": null
},
v18 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "scryfallUrl",
  "storageKey": null
},
v19 = {
  "kind": "Literal",
  "name": "first",
  "value": 48
},
v20 = {
  "kind": "Variable",
  "name": "sortBy",
  "variableName": "sortBy"
},
v21 = [
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
      (v14/*: any*/)
    ],
    "kind": "ObjectValue",
    "name": "filters"
  },
  (v19/*: any*/),
  (v20/*: any*/)
],
v22 = [
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
          (v13/*: any*/),
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
              (v10/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "isKnownCheater",
                "storageKey": null
              },
              (v13/*: any*/)
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
              (v10/*: any*/),
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
              (v13/*: any*/)
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
v23 = {
  "kind": "Variable",
  "name": "cardName",
  "variableName": "cardName"
},
v24 = [
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
  (v15/*: any*/)
],
v25 = [
  (v23/*: any*/),
  (v19/*: any*/),
  (v20/*: any*/)
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
                      "name": "Commander_CardDetail"
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
          (v10/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "breakdownUrl",
            "storageKey": null
          },
          (v11/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Card",
            "kind": "LinkedField",
            "name": "cards",
            "plural": true,
            "selections": [
              (v12/*: any*/),
              (v13/*: any*/)
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
              (v15/*: any*/),
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
          (v13/*: any*/),
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
                  (v13/*: any*/),
                  (v10/*: any*/),
                  (v16/*: any*/),
                  (v17/*: any*/),
                  (v11/*: any*/),
                  (v12/*: any*/),
                  (v18/*: any*/),
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
                "args": (v21/*: any*/),
                "concreteType": "EntryConnection",
                "kind": "LinkedField",
                "name": "entries",
                "plural": false,
                "selections": (v22/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": (v21/*: any*/),
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
            "condition": "showCardDetail",
            "kind": "Condition",
            "passingValue": true,
            "selections": [
              {
                "alias": null,
                "args": [
                  (v23/*: any*/)
                ],
                "concreteType": "Card",
                "kind": "LinkedField",
                "name": "cardDetail",
                "plural": false,
                "selections": [
                  (v10/*: any*/),
                  (v16/*: any*/),
                  (v17/*: any*/),
                  (v11/*: any*/),
                  (v12/*: any*/),
                  (v18/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "cardPreviewImageUrl",
                    "storageKey": null
                  },
                  (v13/*: any*/)
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": [
                  (v23/*: any*/),
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
                    "selections": (v24/*: any*/),
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "CommanderCardStats",
                    "kind": "LinkedField",
                    "name": "withoutCard",
                    "plural": false,
                    "selections": (v24/*: any*/),
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
                "name": "cardEntries",
                "plural": false,
                "selections": (v22/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": (v25/*: any*/),
                "filters": [
                  "cardName",
                  "sortBy"
                ],
                "handle": "connection",
                "key": "Commander_cardEntries",
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
    "id": "ad8859e838edd29f99ce513dae32fc1a",
    "metadata": {},
    "name": "Commander_CommanderQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "241572139939921c20d831da1ba8883c";

import { PreloadableQueryRegistry } from 'relay-runtime';
PreloadableQueryRegistry.set(node.params.id, node);

export default node;
