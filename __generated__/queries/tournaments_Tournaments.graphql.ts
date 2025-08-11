/**
 * @generated SignedSource<<84d6001f9c01dbf43220b8af0a682f1b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type tournaments_Tournaments$data = {
  readonly tournaments: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly id: string;
        readonly " $fragmentSpreads": FragmentRefs<"tournaments_TournamentCard">;
      };
    }>;
  };
  readonly " $fragmentType": "tournaments_Tournaments";
};
export type tournaments_Tournaments$key = {
  readonly " $data"?: tournaments_Tournaments$data;
  readonly " $fragmentSpreads": FragmentRefs<"tournaments_Tournaments">;
};

import AllTournamentsQuery_graphql from './AllTournamentsQuery.graphql';

const node: ReaderFragment = (function(){
var v0 = [
  "tournaments"
];
return {
  "argumentDefinitions": [
    {
      "defaultValue": 100,
      "kind": "LocalArgument",
      "name": "count"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "cursor"
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
      "operation": AllTournamentsQuery_graphql
    }
  },
  "name": "tournaments_Tournaments",
  "selections": [
    {
      "alias": "tournaments",
      "args": null,
      "concreteType": "QueryTournamentsConnection",
      "kind": "LinkedField",
      "name": "__tournaments__tournaments_connection",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "QueryTournamentsConnectionEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "Tournament",
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
                  "name": "tournaments_TournamentCard"
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

(node as any).hash = "a6297831a31a5906da3784d27c73f010";

export default node;
