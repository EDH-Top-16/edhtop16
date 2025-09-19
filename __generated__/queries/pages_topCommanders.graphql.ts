/**
 * @generated SignedSource<<0bfbbd5d0aab05a671e5861dcde883d2>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type pages_topCommanders$data = {
  readonly commanders: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly id: string;
        readonly " $fragmentSpreads": FragmentRefs<"pages_TopCommandersCard">;
      };
    }>;
  };
  readonly " $fragmentType": "pages_topCommanders";
};
export type pages_topCommanders$key = {
  readonly " $data"?: pages_topCommanders$data;
  readonly " $fragmentSpreads": FragmentRefs<"pages_topCommanders">;
};

import TopCommandersQuery_graphql from './TopCommandersQuery.graphql';

const node: ReaderFragment = (function(){
var v0 = [
  "commanders"
];
return {
  "argumentDefinitions": [
    {
      "kind": "RootArgument",
      "name": "colorId"
    },
    {
      "defaultValue": 48,
      "kind": "LocalArgument",
      "name": "count"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "cursor"
    },
    {
      "kind": "RootArgument",
      "name": "minEntries"
    },
    {
      "kind": "RootArgument",
      "name": "minTournamentSize"
    },
    {
      "kind": "RootArgument",
      "name": "sortBy"
    },
    {
      "kind": "RootArgument",
      "name": "timePeriod"
    }
  ],
  "kind": "Fragment",
  "metadata": {
    "connection": [
      {
        "count": "count",
        "cursor": "cursor",
        "direction": "forward",
        "path": (v0/*: any*/)
      }
    ],
    "throwOnFieldError": true,
    "refetch": {
      "connection": {
        "forward": {
          "count": "count",
          "cursor": "cursor"
        },
        "backward": null,
        "path": (v0/*: any*/)
      },
      "fragmentPathInResult": [],
      "operation": TopCommandersQuery_graphql
    }
  },
  "name": "pages_topCommanders",
  "selections": [
    {
      "alias": "commanders",
      "args": [
        {
          "kind": "Variable",
          "name": "colorId",
          "variableName": "colorId"
        },
        {
          "kind": "Variable",
          "name": "minEntries",
          "variableName": "minEntries"
        },
        {
          "kind": "Variable",
          "name": "minTournamentSize",
          "variableName": "minTournamentSize"
        },
        {
          "kind": "Variable",
          "name": "sortBy",
          "variableName": "sortBy"
        },
        {
          "kind": "Variable",
          "name": "timePeriod",
          "variableName": "timePeriod"
        }
      ],
      "concreteType": "CommanderConnection",
      "kind": "LinkedField",
      "name": "__pages__commanders_connection",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "CommanderEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "Commander",
              "kind": "LinkedField",
              "name": "node",
              "plural": false,
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "id",
                  "storageKey": null
                },
                {
                  "args": null,
                  "kind": "FragmentSpread",
                  "name": "pages_TopCommandersCard"
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
      "storageKey": null
    }
  ],
  "type": "Query",
  "abstractKey": null
};
})();

(node as any).hash = "627a0bbccaaf63862979fe3c1dc8a46b";

export default node;
