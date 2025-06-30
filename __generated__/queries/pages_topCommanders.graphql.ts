/**
 * @generated SignedSource<<2329427560741b613a6e6193a698c614>>
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
      "concreteType": "QueryCommandersConnection",
      "kind": "LinkedField",
      "name": "__pages__commanders_connection",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "QueryCommandersConnectionEdge",
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

(node as any).hash = "b5a6c24d9b40c399fa950a403034faa7";

export default node;
