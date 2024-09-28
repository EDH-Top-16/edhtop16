/**
 * @generated SignedSource<<1960116ea69505121df32c9a3fe27ca8>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type TID_TournamentPageFallbackQuery$variables = {
  TID: string;
};
export type TID_TournamentPageFallbackQuery$data = {
  readonly tournament: {
    readonly " $fragmentSpreads": FragmentRefs<"TID_TournamentPageShell">;
  };
};
export type TID_TournamentPageFallbackQuery = {
  response: TID_TournamentPageFallbackQuery$data;
  variables: TID_TournamentPageFallbackQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "TID"
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
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "TID_TournamentPageFallbackQuery",
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
    "name": "TID_TournamentPageFallbackQuery",
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
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "name",
            "storageKey": null
          },
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
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "imageUrls",
                    "storageKey": null
                  },
                  (v2/*: any*/)
                ],
                "storageKey": null
              },
              (v2/*: any*/)
            ],
            "storageKey": "entries(maxStanding:1)"
          },
          (v2/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "cfd40731878c0e5420eeb4c590e1bdb5",
    "id": null,
    "metadata": {},
    "name": "TID_TournamentPageFallbackQuery",
    "operationKind": "query",
    "text": "query TID_TournamentPageFallbackQuery(\n  $TID: String!\n) {\n  tournament(TID: $TID) {\n    ...TID_TournamentPageShell\n    id\n  }\n}\n\nfragment TID_TournamentBanner on Tournament {\n  name\n  size\n  tournamentDate\n  bracketUrl\n  winner: entries(maxStanding: 1) {\n    commander {\n      imageUrls\n      id\n    }\n    id\n  }\n}\n\nfragment TID_TournamentMeta on Tournament {\n  name\n}\n\nfragment TID_TournamentPageShell on Tournament {\n  ...TID_TournamentBanner\n  ...TID_TournamentMeta\n}\n"
  }
};
})();

(node as any).hash = "fd89616d5b7559f3d704c6f28055f38d";

export default node;
