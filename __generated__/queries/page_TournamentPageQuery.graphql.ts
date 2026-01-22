/**
 * @generated SignedSource<<863cb98db62297ea78ac80159071810d>>
 * @relayHash 95ca410f50458f0373124f1939d56dd7
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 95ca410f50458f0373124f1939d56dd7

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type page_TournamentPageQuery$variables = {
  commander?: string | null | undefined;
  tid: string;
};
export type page_TournamentPageQuery$data = {
  readonly tournament: {
    readonly TID: string;
    readonly breakdown: ReadonlyArray<{
      readonly commander: {
        readonly id: string;
      };
      readonly " $fragmentSpreads": FragmentRefs<"page_BreakdownGroupCard">;
    }>;
    readonly breakdownEntries: ReadonlyArray<{
      readonly id: string;
      readonly " $fragmentSpreads": FragmentRefs<"page_EntryCard">;
    }>;
    readonly entries: ReadonlyArray<{
      readonly id: string;
      readonly " $fragmentSpreads": FragmentRefs<"page_EntryCard">;
    }>;
    readonly promo: {
      readonly " $fragmentSpreads": FragmentRefs<"promo_EmbededPromo">;
    } | null | undefined;
    readonly " $fragmentSpreads": FragmentRefs<"page_TournamentBanner" | "page_TournamentMeta">;
  };
};
export type page_TournamentPageQuery = {
  response: page_TournamentPageQuery$data;
  variables: page_TournamentPageQuery$variables;
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
  "name": "tid"
},
v2 = [
  {
    "kind": "Variable",
    "name": "TID",
    "variableName": "tid"
  }
],
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "TID",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v5 = [
  (v4/*: any*/),
  {
    "args": null,
    "kind": "FragmentSpread",
    "name": "page_EntryCard"
  }
],
v6 = [
  {
    "kind": "Variable",
    "name": "commander",
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
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "breakdownUrl",
  "storageKey": null
},
v10 = [
  (v4/*: any*/),
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
      (v7/*: any*/),
      (v9/*: any*/),
      (v8/*: any*/),
      (v4/*: any*/)
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": {
      "throwOnFieldError": true
    },
    "name": "page_TournamentPageQuery",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "Tournament",
        "kind": "LinkedField",
        "name": "tournament",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "page_TournamentBanner"
          },
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "page_TournamentMeta"
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
          {
            "alias": null,
            "args": null,
            "concreteType": "Entry",
            "kind": "LinkedField",
            "name": "entries",
            "plural": true,
            "selections": (v5/*: any*/),
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "TournamentBreakdownGroup",
            "kind": "LinkedField",
            "name": "breakdown",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "Commander",
                "kind": "LinkedField",
                "name": "commander",
                "plural": false,
                "selections": [
                  (v4/*: any*/)
                ],
                "storageKey": null
              },
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "page_BreakdownGroupCard"
              }
            ],
            "storageKey": null
          },
          {
            "alias": "breakdownEntries",
            "args": (v6/*: any*/),
            "concreteType": "Entry",
            "kind": "LinkedField",
            "name": "entries",
            "plural": true,
            "selections": (v5/*: any*/),
            "storageKey": null
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
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "page_TournamentPageQuery",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "Tournament",
        "kind": "LinkedField",
        "name": "tournament",
        "plural": false,
        "selections": [
          (v3/*: any*/),
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
            "name": "bracketUrl",
            "storageKey": null
          },
          {
            "alias": "winner",
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
                "concreteType": "Commander",
                "kind": "LinkedField",
                "name": "commander",
                "plural": false,
                "selections": [
                  (v8/*: any*/),
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
            "args": null,
            "concreteType": "Entry",
            "kind": "LinkedField",
            "name": "entries",
            "plural": true,
            "selections": (v10/*: any*/),
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "TournamentBreakdownGroup",
            "kind": "LinkedField",
            "name": "breakdown",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "Commander",
                "kind": "LinkedField",
                "name": "commander",
                "plural": false,
                "selections": [
                  (v4/*: any*/),
                  (v7/*: any*/),
                  (v9/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "colorId",
                    "storageKey": null
                  },
                  (v8/*: any*/)
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "entries",
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
            "storageKey": null
          },
          {
            "alias": "breakdownEntries",
            "args": (v6/*: any*/),
            "concreteType": "Entry",
            "kind": "LinkedField",
            "name": "entries",
            "plural": true,
            "selections": (v10/*: any*/),
            "storageKey": null
          },
          (v4/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "95ca410f50458f0373124f1939d56dd7",
    "metadata": {},
    "name": "page_TournamentPageQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "1a395778896520da63e5153b8e5210fa";

import { PreloadableQueryRegistry } from 'relay-runtime';
PreloadableQueryRegistry.set(node.params.id, node);

export default node;
