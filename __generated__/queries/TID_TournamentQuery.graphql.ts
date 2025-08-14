/**
 * @generated SignedSource<<7456dee4455419f66909aa8ccffbe658>>
 * @relayHash cd4c6d4f560415ba44e21acd8f837bd6
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID cd4c6d4f560415ba44e21acd8f837bd6

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type TID_TournamentQuery$variables = {
  TID: string;
  commander?: string | null | undefined;
  showBreakdown: boolean;
  showBreakdownCommander: boolean;
  showStandings: boolean;
};
export type TID_TournamentQuery$data = {
  readonly tournament: {
    readonly breakdown?: ReadonlyArray<{
      readonly commander: {
        readonly id: string;
      };
      readonly " $fragmentSpreads": FragmentRefs<"tournamentPage_BreakdownGroupCard">;
    }>;
    readonly breakdownEntries?: ReadonlyArray<{
      readonly id: string;
      readonly " $fragmentSpreads": FragmentRefs<"tournamentPage_EntryCard">;
    }>;
    readonly entries?: ReadonlyArray<{
      readonly id: string;
      readonly " $fragmentSpreads": FragmentRefs<"tournamentPage_EntryCard">;
    }>;
    readonly " $fragmentSpreads": FragmentRefs<"tournamentPage_TournamentPageShell" | "useTournamentPage_baseTournament" | "useTournamentPage_commanderData">;
  };
};
export type TID_TournamentQuery = {
  response: TID_TournamentQuery$data;
  variables: TID_TournamentQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "TID"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "commander"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "showBreakdown"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "showBreakdownCommander"
},
v4 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "showStandings"
},
v5 = [
  {
    "kind": "Variable",
    "name": "TID",
    "variableName": "TID"
  }
],
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v7 = [
  (v6/*: any*/),
  {
    "args": null,
    "kind": "FragmentSpread",
    "name": "tournamentPage_EntryCard"
  }
],
v8 = [
  {
    "kind": "Variable",
    "name": "commander",
    "variableName": "commander"
  }
],
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v10 = {
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
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "breakdownUrl",
  "storageKey": null
},
v12 = [
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
      (v9/*: any*/),
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "isKnownCheater",
        "storageKey": null
      },
      (v6/*: any*/)
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
      (v9/*: any*/),
      (v11/*: any*/),
      (v10/*: any*/),
      (v6/*: any*/)
    ],
    "storageKey": null
  }
];
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
    "name": "TID_TournamentQuery",
    "selections": [
      {
        "alias": null,
        "args": (v5/*: any*/),
        "concreteType": "Tournament",
        "kind": "LinkedField",
        "name": "tournament",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "tournamentPage_TournamentPageShell"
          },
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "useTournamentPage_baseTournament"
          },
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "useTournamentPage_commanderData"
          },
          {
            "condition": "showStandings",
            "kind": "Condition",
            "passingValue": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "Entry",
                "kind": "LinkedField",
                "name": "entries",
                "plural": true,
                "selections": (v7/*: any*/),
                "storageKey": null
              }
            ]
          },
          {
            "condition": "showBreakdown",
            "kind": "Condition",
            "passingValue": true,
            "selections": [
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
                      (v6/*: any*/)
                    ],
                    "storageKey": null
                  },
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "tournamentPage_BreakdownGroupCard"
                  }
                ],
                "storageKey": null
              }
            ]
          },
          {
            "condition": "showBreakdownCommander",
            "kind": "Condition",
            "passingValue": true,
            "selections": [
              {
                "alias": "breakdownEntries",
                "args": (v8/*: any*/),
                "concreteType": "Entry",
                "kind": "LinkedField",
                "name": "entries",
                "plural": true,
                "selections": (v7/*: any*/),
                "storageKey": null
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
      (v0/*: any*/),
      (v1/*: any*/),
      (v4/*: any*/),
      (v2/*: any*/),
      (v3/*: any*/)
    ],
    "kind": "Operation",
    "name": "TID_TournamentQuery",
    "selections": [
      {
        "alias": null,
        "args": (v5/*: any*/),
        "concreteType": "Tournament",
        "kind": "LinkedField",
        "name": "tournament",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "TID",
            "storageKey": null
          },
          (v9/*: any*/),
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
                  (v10/*: any*/),
                  (v6/*: any*/)
                ],
                "storageKey": null
              },
              (v6/*: any*/)
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
            "condition": "showStandings",
            "kind": "Condition",
            "passingValue": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "Entry",
                "kind": "LinkedField",
                "name": "entries",
                "plural": true,
                "selections": (v12/*: any*/),
                "storageKey": null
              }
            ]
          },
          {
            "condition": "showBreakdown",
            "kind": "Condition",
            "passingValue": true,
            "selections": [
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
                      (v6/*: any*/),
                      (v9/*: any*/),
                      (v11/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "colorId",
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
              }
            ]
          },
          (v6/*: any*/),
          {
            "condition": "showBreakdownCommander",
            "kind": "Condition",
            "passingValue": true,
            "selections": [
              {
                "alias": "breakdownEntries",
                "args": (v8/*: any*/),
                "concreteType": "Entry",
                "kind": "LinkedField",
                "name": "entries",
                "plural": true,
                "selections": (v12/*: any*/),
                "storageKey": null
              }
            ]
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "cd4c6d4f560415ba44e21acd8f837bd6",
    "metadata": {},
    "name": "TID_TournamentQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "c965406cb6f5a508f6b3f108e6361909";

import { PreloadableQueryRegistry } from 'relay-runtime';
PreloadableQueryRegistry.set(node.params.id, node);

export default node;
