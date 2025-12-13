/**
 * @generated SignedSource<<10595f75df902624401fef9bde06dc39>>
 * @relayHash d1458635a3f372b11bf94a28be4ecb49
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID d1458635a3f372b11bf94a28be4ecb49

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
  "kind": "Variable",
  "name": "maxStanding",
  "variableName": "maxStanding"
},
v11 = {
  "kind": "Variable",
  "name": "timePeriod",
  "variableName": "timePeriod"
},
v12 = [
  (v10/*: any*/),
  {
    "kind": "Variable",
    "name": "minEventSize",
    "variableName": "minEventSize"
  },
  (v11/*: any*/)
],
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "type",
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "scryfallUrl",
  "storageKey": null
},
v17 = {
  "kind": "Literal",
  "name": "first",
  "value": 48
},
v18 = {
  "kind": "Variable",
  "name": "sortBy",
  "variableName": "sortBy"
},
v19 = [
  {
    "fields": (v12/*: any*/),
    "kind": "ObjectValue",
    "name": "filters"
  },
  (v17/*: any*/),
  (v18/*: any*/)
],
v20 = [
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
              (v14/*: any*/),
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
              (v14/*: any*/),
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
v21 = {
  "kind": "Variable",
  "name": "cardName",
  "variableName": "cardName"
},
v22 = [
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
v23 = [
  (v21/*: any*/),
  (v17/*: any*/),
  (v18/*: any*/)
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
                      "args": (v12/*: any*/),
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
          (v13/*: any*/),
          {
            "condition": "showStaples",
            "kind": "Condition",
            "passingValue": true,
            "selections": [
              (v14/*: any*/),
              {
                "alias": null,
                "args": [
                  {
                    "fields": [
                      (v10/*: any*/),
                      {
                        "kind": "Variable",
                        "name": "minSize",
                        "variableName": "minEventSize"
                      },
                      (v11/*: any*/)
                    ],
                    "kind": "ObjectValue",
                    "name": "filters"
                  }
                ],
                "concreteType": "Card",
                "kind": "LinkedField",
                "name": "staples",
                "plural": true,
                "selections": [
                  (v13/*: any*/),
                  (v14/*: any*/),
                  (v15/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "manaCost",
                    "storageKey": null
                  },
                  (v16/*: any*/),
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
                "args": (v19/*: any*/),
                "concreteType": "EntryConnection",
                "kind": "LinkedField",
                "name": "entries",
                "plural": false,
                "selections": (v20/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": (v19/*: any*/),
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
              (v14/*: any*/),
              {
                "alias": null,
                "args": [
                  (v21/*: any*/)
                ],
                "concreteType": "Card",
                "kind": "LinkedField",
                "name": "cardDetail",
                "plural": false,
                "selections": [
                  (v14/*: any*/),
                  (v15/*: any*/),
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
                  (v16/*: any*/),
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
                  (v21/*: any*/),
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
                    "selections": (v22/*: any*/),
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "CommanderCardStats",
                    "kind": "LinkedField",
                    "name": "withoutCard",
                    "plural": false,
                    "selections": (v22/*: any*/),
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": (v23/*: any*/),
                "concreteType": "EntryConnection",
                "kind": "LinkedField",
                "name": "cardEntries",
                "plural": false,
                "selections": (v20/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": (v23/*: any*/),
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
    "id": "d1458635a3f372b11bf94a28be4ecb49",
    "metadata": {},
    "name": "commanderPage_CommanderQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "00e2db453ffe3f15def0f71e3c749184";

import { PreloadableQueryRegistry } from 'relay-runtime';
PreloadableQueryRegistry.set(node.params.id, node);

export default node;
