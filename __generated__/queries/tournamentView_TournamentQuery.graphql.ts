/**
 * @generated SignedSource<<aaa0e5b91e03c903c0c269a01c00909c>>
 * @relayHash bb25aff5f54d221677fca5a5a720b69d
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID bb25aff5f54d221677fca5a5a720b69d

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type tournamentView_TournamentQuery$variables = {
  TID: string;
  commander?: string | null | undefined;
  showBreakdown: boolean;
  showBreakdownCommander: boolean;
  showStandings: boolean;
};
export type tournamentView_TournamentQuery$data = {
  readonly tournament: {
    readonly breakdown?: ReadonlyArray<{
      readonly commander: {
        readonly id: string;
      };
      readonly " $fragmentSpreads": FragmentRefs<"tournamentView_BreakdownGroupCard">;
    }>;
    readonly breakdownEntries?: ReadonlyArray<{
      readonly id: string;
      readonly " $fragmentSpreads": FragmentRefs<"tournamentView_EntryCard">;
    }>;
    readonly entries?: ReadonlyArray<{
      readonly id: string;
      readonly " $fragmentSpreads": FragmentRefs<"tournamentView_EntryCard">;
    }>;
  };
};
export type tournamentView_TournamentQuery = {
  response: tournamentView_TournamentQuery$data;
  variables: tournamentView_TournamentQuery$variables;
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
    "name": "tournamentView_EntryCard"
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
  "kind": "ScalarField",
  "name": "breakdownUrl",
  "storageKey": null
},
v11 = {
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
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "isKnownChud",
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
      (v10/*: any*/),
      (v11/*: any*/),
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
    "metadata": {
      "throwOnFieldError": true
    },
    "name": "tournamentView_TournamentQuery",
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
                    "name": "tournamentView_BreakdownGroupCard"
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
    "name": "tournamentView_TournamentQuery",
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
                      (v10/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "colorId",
                        "storageKey": null
                      },
                      (v11/*: any*/)
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
          },
          (v6/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "bb25aff5f54d221677fca5a5a720b69d",
    "metadata": {},
    "name": "tournamentView_TournamentQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "88b1d4694612a57397dec6f17de85752";

import { PreloadableQueryRegistry } from 'relay-runtime';
PreloadableQueryRegistry.set(node.params.id, node);

export default node;
