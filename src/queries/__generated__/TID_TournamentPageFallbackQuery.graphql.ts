/**
 * @generated SignedSource<<6179e7de366e35ac3b6454c7acb899b5>>
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
                      (v2/*: any*/)
                    ],
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
          (v2/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "57c23b56501604cff8fc7fa2a0bbc24c",
    "id": null,
    "metadata": {},
    "name": "TID_TournamentPageFallbackQuery",
    "operationKind": "query",
    "text": "query TID_TournamentPageFallbackQuery(\n  $TID: String!\n) {\n  tournament(TID: $TID) {\n    ...TID_TournamentPageShell\n    id\n  }\n}\n\nfragment TID_TournamentBanner on Tournament {\n  name\n  size\n  tournamentDate\n  bracketUrl\n  winner: entries(maxStanding: 1) {\n    commander {\n      cards {\n        imageUrls\n        id\n      }\n      id\n    }\n    id\n  }\n}\n\nfragment TID_TournamentMeta on Tournament {\n  name\n}\n\nfragment TID_TournamentPageShell on Tournament {\n  ...TID_TournamentBanner\n  ...TID_TournamentMeta\n  promo {\n    ...promo_EmbededPromo\n  }\n}\n\nfragment promo_EmbededPromo on FirstPartyPromo {\n  title\n  description\n  buttonText\n  backgroundImageUrl\n  imageUrl\n  href\n}\n"
  }
};
})();

(node as any).hash = "fd89616d5b7559f3d704c6f28055f38d";

export default node;
