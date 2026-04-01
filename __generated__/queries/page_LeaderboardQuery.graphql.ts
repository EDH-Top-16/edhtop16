/**
 * @generated SignedSource<<ec54c84c411f84b16fee4c063506070f>>
 * @relayHash bfb83737759eb1d3f105d57c7af8cd6f
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID bfb83737759eb1d3f105d57c7af8cd6f

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type page_LeaderboardQuery$variables = Record<PropertyKey, never>;
export type page_LeaderboardQuery$data = {
  readonly leaderboard: ReadonlyArray<{
    readonly id: string;
    readonly rank: number;
    readonly " $fragmentSpreads": FragmentRefs<"page_LeaderboardRow" | "page_LeaderboardTopPlayer">;
  }>;
};
export type page_LeaderboardQuery = {
  response: page_LeaderboardQuery$data;
  variables: page_LeaderboardQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "rank",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": {
      "throwOnFieldError": true
    },
    "name": "page_LeaderboardQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "LeaderboardEntry",
        "kind": "LinkedField",
        "name": "leaderboard",
        "plural": true,
        "selections": [
          (v0/*: any*/),
          (v1/*: any*/),
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "page_LeaderboardTopPlayer"
          },
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "page_LeaderboardRow"
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
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "page_LeaderboardQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "LeaderboardEntry",
        "kind": "LinkedField",
        "name": "leaderboard",
        "plural": true,
        "selections": [
          (v0/*: any*/),
          (v1/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "drawRate",
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
            "concreteType": "Player",
            "kind": "LinkedField",
            "name": "player",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "topdeckProfile",
                "storageKey": null
              },
              (v0/*: any*/)
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "Commander",
            "kind": "LinkedField",
            "name": "topCommanders",
            "plural": true,
            "selections": [
              (v2/*: any*/),
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
                  (v0/*: any*/)
                ],
                "storageKey": null
              },
              (v0/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "bfb83737759eb1d3f105d57c7af8cd6f",
    "metadata": {},
    "name": "page_LeaderboardQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "4e5a13c8d3cc010b6b22dec0651e2eb3";

import { PreloadableQueryRegistry } from 'relay-runtime';
PreloadableQueryRegistry.set(node.params.id, node);

export default node;
