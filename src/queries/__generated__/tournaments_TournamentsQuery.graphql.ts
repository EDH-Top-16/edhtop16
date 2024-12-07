/**
 * @generated SignedSource<<d9743000ae51952c24b02c195b8d8f45>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type TimePeriod = "ALL_TIME" | "ONE_MONTH" | "ONE_YEAR" | "SIX_MONTHS" | "THREE_MONTHS" | "%future added value";
export type TournamentSortBy = "DATE" | "PLAYERS" | "%future added value";
export type tournaments_TournamentsQuery$variables = {
  minSize: number;
  sortBy: TournamentSortBy;
  timePeriod: TimePeriod;
};
export type tournaments_TournamentsQuery$data = {
  readonly tournaments: ReadonlyArray<{
    readonly id: string;
    readonly " $fragmentSpreads": FragmentRefs<"tournaments_TournamentCard">;
  }>;
};
export type tournaments_TournamentsQuery = {
  response: tournaments_TournamentsQuery$data;
  variables: tournaments_TournamentsQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "minSize"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "sortBy"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "timePeriod"
},
v3 = [
  {
    "fields": [
      {
        "kind": "Variable",
        "name": "minSize",
        "variableName": "minSize"
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
  {
    "kind": "Variable",
    "name": "sortBy",
    "variableName": "sortBy"
  }
],
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "tournaments_TournamentsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": "Tournament",
        "kind": "LinkedField",
        "name": "tournaments",
        "plural": true,
        "selections": [
          (v4/*: any*/),
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "tournaments_TournamentCard"
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
      (v2/*: any*/),
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "tournaments_TournamentsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": "Tournament",
        "kind": "LinkedField",
        "name": "tournaments",
        "plural": true,
        "selections": [
          (v4/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "TID",
            "storageKey": null
          },
          (v5/*: any*/),
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
                "concreteType": "Player",
                "kind": "LinkedField",
                "name": "player",
                "plural": false,
                "selections": [
                  (v5/*: any*/),
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
              (v4/*: any*/)
            ],
            "storageKey": "entries(maxStanding:1)"
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "592200220dd52b7e92d339237b8f9238",
    "id": null,
    "metadata": {},
    "name": "tournaments_TournamentsQuery",
    "operationKind": "query",
    "text": "query tournaments_TournamentsQuery(\n  $timePeriod: TimePeriod!\n  $sortBy: TournamentSortBy!\n  $minSize: Int!\n) {\n  tournaments(filters: {timePeriod: $timePeriod, minSize: $minSize}, sortBy: $sortBy) {\n    id\n    ...tournaments_TournamentCard\n  }\n}\n\nfragment tournaments_TournamentCard on Tournament {\n  TID\n  name\n  size\n  tournamentDate\n  entries(maxStanding: 1) {\n    player {\n      name\n      id\n    }\n    commander {\n      imageUrls\n      id\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "d7becb4d4c7a30f7a344f7612262cfc2";

export default node;
