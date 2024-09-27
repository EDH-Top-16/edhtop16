/**
 * @generated SignedSource<<60b365f27d02d6939c9d8b3f15e342ba>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type TID_TournamentQuery$variables = {
  TID: string;
  breakdown: boolean;
};
export type TID_TournamentQuery$data = {
  readonly tournament: {
    readonly breakdown?: ReadonlyArray<{
      readonly commander: {
        readonly id: string;
      };
      readonly " $fragmentSpreads": FragmentRefs<"TID_BreakdownCard">;
    }>;
    readonly entries?: ReadonlyArray<{
      readonly id: string;
      readonly " $fragmentSpreads": FragmentRefs<"TID_EntryCard">;
    }>;
    readonly " $fragmentSpreads": FragmentRefs<"TID_TournamentPageShell">;
  };
};
export type TID_TournamentQuery = {
  response: TID_TournamentQuery$data;
  variables: TID_TournamentQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "TID"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "breakdown"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "TID",
    "variableName": "TID"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "imageUrls",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "breakdownUrl",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "TID_TournamentQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Tournament",
        "kind": "LinkedField",
        "name": "tournament",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "TID_TournamentPageShell"
          },
          {
            "condition": "breakdown",
            "kind": "Condition",
            "passingValue": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "Entry",
                "kind": "LinkedField",
                "name": "entries",
                "plural": true,
                "selections": [
                  (v2/*: any*/),
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "TID_EntryCard"
                  }
                ],
                "storageKey": null
              }
            ]
          },
          {
            "condition": "breakdown",
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
                      (v2/*: any*/)
                    ],
                    "storageKey": null
                  },
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "TID_BreakdownCard"
                  }
                ],
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "TID_TournamentQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Tournament",
        "kind": "LinkedField",
        "name": "tournament",
        "plural": false,
        "selections": [
          (v3/*: any*/),
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
                  (v4/*: any*/),
                  (v2/*: any*/)
                ],
                "storageKey": null
              },
              (v2/*: any*/)
            ],
            "storageKey": "entries(maxStanding:1)"
          },
          {
            "condition": "breakdown",
            "kind": "Condition",
            "passingValue": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "Entry",
                "kind": "LinkedField",
                "name": "entries",
                "plural": true,
                "selections": [
                  (v2/*: any*/),
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
                      (v3/*: any*/),
                      (v2/*: any*/)
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
                      (v3/*: any*/),
                      (v4/*: any*/),
                      (v5/*: any*/),
                      (v2/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ]
          },
          {
            "condition": "breakdown",
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
                      (v2/*: any*/),
                      (v3/*: any*/),
                      (v4/*: any*/),
                      (v5/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "colorId",
                        "storageKey": null
                      }
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
          (v2/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "f3ccd2d26e9fa389f0b4799889e7f617",
    "id": null,
    "metadata": {},
    "name": "TID_TournamentQuery",
    "operationKind": "query",
    "text": "query TID_TournamentQuery(\n  $TID: String!\n  $breakdown: Boolean!\n) {\n  tournament(TID: $TID) {\n    ...TID_TournamentPageShell\n    entries @skip(if: $breakdown) {\n      id\n      ...TID_EntryCard\n    }\n    breakdown @include(if: $breakdown) {\n      commander {\n        id\n      }\n      ...TID_BreakdownCard\n    }\n    id\n  }\n}\n\nfragment TID_BreakdownCard on TournamentBreakdownGroup {\n  commander {\n    name\n    imageUrls\n    breakdownUrl\n    colorId\n    id\n  }\n  entries\n  topCuts\n  conversionRate\n}\n\nfragment TID_EntryCard on Entry {\n  standing\n  wins\n  losses\n  draws\n  decklist\n  player {\n    name\n    id\n  }\n  commander {\n    name\n    imageUrls\n    breakdownUrl\n    id\n  }\n}\n\nfragment TID_TournamentBanner on Tournament {\n  name\n  size\n  tournamentDate\n  winner: entries(maxStanding: 1) {\n    commander {\n      imageUrls\n      id\n    }\n    id\n  }\n}\n\nfragment TID_TournamentMeta on Tournament {\n  name\n}\n\nfragment TID_TournamentPageShell on Tournament {\n  ...TID_TournamentBanner\n  ...TID_TournamentMeta\n}\n"
  }
};
})();

(node as any).hash = "a56d8f20eaa0f1bf7770b55e6f335ef2";

export default node;
