/**
 * @generated SignedSource<<1293e6582123a2f030d312c965f8d82c>>
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
      readonly " $fragmentSpreads": FragmentRefs<"TID_BreakdownGroupCard">;
    }>;
    readonly breakdownEntries?: ReadonlyArray<{
      readonly id: string;
      readonly " $fragmentSpreads": FragmentRefs<"TID_EntryCard">;
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
    "name": "TID_EntryCard"
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
            "name": "TID_TournamentPageShell"
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
                    "name": "TID_BreakdownGroupCard"
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
    "cacheID": "b78c587c90ab03832c3af274955dffdf",
    "id": null,
    "metadata": {},
    "name": "TID_TournamentQuery",
    "operationKind": "query",
    "text": "query TID_TournamentQuery(\n  $TID: String!\n  $commander: String\n  $showStandings: Boolean!\n  $showBreakdown: Boolean!\n  $showBreakdownCommander: Boolean!\n) {\n  tournament(TID: $TID) {\n    ...TID_TournamentPageShell\n    entries @include(if: $showStandings) {\n      id\n      ...TID_EntryCard\n    }\n    breakdown @include(if: $showBreakdown) {\n      commander {\n        id\n      }\n      ...TID_BreakdownGroupCard\n    }\n    breakdownEntries: entries(commander: $commander) @include(if: $showBreakdownCommander) {\n      id\n      ...TID_EntryCard\n    }\n    id\n  }\n}\n\nfragment TID_BreakdownGroupCard on TournamentBreakdownGroup {\n  commander {\n    name\n    breakdownUrl\n    colorId\n    cards {\n      imageUrls\n      id\n    }\n    id\n  }\n  entries\n  topCuts\n  conversionRate\n}\n\nfragment TID_EntryCard on Entry {\n  standing\n  wins\n  losses\n  draws\n  decklist\n  player {\n    name\n    id\n  }\n  commander {\n    name\n    breakdownUrl\n    cards {\n      imageUrls\n      id\n    }\n    id\n  }\n}\n\nfragment TID_TournamentBanner on Tournament {\n  name\n  size\n  tournamentDate\n  bracketUrl\n  winner: entries(maxStanding: 1) {\n    commander {\n      cards {\n        imageUrls\n        id\n      }\n      id\n    }\n    id\n  }\n}\n\nfragment TID_TournamentMeta on Tournament {\n  name\n}\n\nfragment TID_TournamentPageShell on Tournament {\n  ...TID_TournamentBanner\n  ...TID_TournamentMeta\n}\n"
  }
};
})();

(node as any).hash = "398419d931fff736ab9bba066a2c9fb7";

export default node;
