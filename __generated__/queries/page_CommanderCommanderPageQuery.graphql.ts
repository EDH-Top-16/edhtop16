/**
 * @generated SignedSource<<2fcb214bcb8aecc4b0529942397fccc2>>
 * @relayHash a99cd6777bbaf0de240518c72d8dae78
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID a99cd6777bbaf0de240518c72d8dae78

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type EntriesSortBy = "NEW" | "TOP" | "%future added value";
export type TimePeriod = "ALL_TIME" | "ONE_MONTH" | "ONE_YEAR" | "POST_BAN" | "SIX_MONTHS" | "THREE_MONTHS" | "%future added value";
export type page_CommanderCommanderPageQuery$variables = {
  card?: string | null | undefined;
  commander: string;
  maxStanding?: number | null | undefined;
  minEventSize?: number | null | undefined;
  sortBy?: EntriesSortBy | null | undefined;
  timePeriod?: TimePeriod | null | undefined;
};
export type page_CommanderCommanderPageQuery$data = {
  readonly commander: {
    readonly breakdownUrl: string;
    readonly name: string;
    readonly promo: {
      readonly " $fragmentSpreads": FragmentRefs<"promo_EmbededPromo">;
    } | null | undefined;
    readonly stats: {
      readonly conversionRate: number;
      readonly count: number;
      readonly metaShare: number;
    };
    readonly " $fragmentSpreads": FragmentRefs<"page_CommanderCardDetail" | "page_CommanderCommanderBanner" | "page_CommanderCommanderMeta" | "page_CommanderCommanderStaples" | "page_Commanderentries">;
  };
};
export type page_CommanderCommanderPageQuery = {
  response: page_CommanderCommanderPageQuery$data;
  variables: page_CommanderCommanderPageQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "card"
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
  "defaultValue": 60,
  "kind": "LocalArgument",
  "name": "minEventSize"
},
v4 = {
  "defaultValue": "TOP",
  "kind": "LocalArgument",
  "name": "sortBy"
},
v5 = {
  "defaultValue": "ONE_YEAR",
  "kind": "LocalArgument",
  "name": "timePeriod"
},
v6 = [
  {
    "kind": "Variable",
    "name": "name",
    "variableName": "commander"
  }
],
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "breakdownUrl",
  "storageKey": null
},
v9 = {
  "kind": "Variable",
  "name": "timePeriod",
  "variableName": "timePeriod"
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "conversionRate",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": [
    {
      "fields": [
        {
          "kind": "Variable",
          "name": "minSize",
          "variableName": "minEventSize"
        },
        (v9/*: any*/)
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
    (v10/*: any*/),
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
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "colorId",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "imageUrls",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
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
      (v9/*: any*/)
    ],
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
          (v14/*: any*/),
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
              (v7/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "isKnownCheater",
                "storageKey": null
              },
              (v14/*: any*/)
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
              (v7/*: any*/),
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
              (v14/*: any*/)
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
  "variableName": "card"
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
  (v10/*: any*/)
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
      (v5/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": {
      "throwOnFieldError": true
    },
    "name": "page_CommanderCommanderPageQuery",
    "selections": [
      {
        "alias": null,
        "args": (v6/*: any*/),
        "concreteType": "Commander",
        "kind": "LinkedField",
        "name": "commander",
        "plural": false,
        "selections": [
          (v7/*: any*/),
          (v8/*: any*/),
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "page_CommanderCommanderBanner"
          },
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "page_CommanderCommanderMeta"
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
                "args": null,
                "kind": "FragmentSpread",
                "name": "promo_EmbededPromo"
              }
            ],
            "storageKey": null
          },
          (v11/*: any*/),
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "page_CommanderCommanderStaples"
          },
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "page_Commanderentries"
          },
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "page_CommanderCardDetail"
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
      (v0/*: any*/),
      (v4/*: any*/),
      (v3/*: any*/),
      (v2/*: any*/),
      (v5/*: any*/)
    ],
    "kind": "Operation",
    "name": "page_CommanderCommanderPageQuery",
    "selections": [
      {
        "alias": null,
        "args": (v6/*: any*/),
        "concreteType": "Commander",
        "kind": "LinkedField",
        "name": "commander",
        "plural": false,
        "selections": [
          (v7/*: any*/),
          (v8/*: any*/),
          (v12/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Card",
            "kind": "LinkedField",
            "name": "cards",
            "plural": true,
            "selections": [
              (v13/*: any*/),
              (v14/*: any*/)
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
          (v11/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Card",
            "kind": "LinkedField",
            "name": "staples",
            "plural": true,
            "selections": [
              (v14/*: any*/),
              (v7/*: any*/),
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
          },
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
            "key": "page_Commander__entries",
            "kind": "LinkedHandle",
            "name": "entries"
          },
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
              (v7/*: any*/),
              (v15/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "cmc",
                "storageKey": null
              },
              (v12/*: any*/),
              (v13/*: any*/),
              (v16/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "cardPreviewImageUrl",
                "storageKey": null
              },
              (v14/*: any*/)
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
            "key": "page_Commander__cardEntries",
            "kind": "LinkedHandle",
            "name": "cardEntries"
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "a99cd6777bbaf0de240518c72d8dae78",
    "metadata": {},
    "name": "page_CommanderCommanderPageQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "6bb53003adebf29ecfdfff3f0956ba2b";

import { PreloadableQueryRegistry } from 'relay-runtime';
PreloadableQueryRegistry.set(node.params.id, node);

export default node;
