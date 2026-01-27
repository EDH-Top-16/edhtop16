/**
 * @generated SignedSource<<95390bbbb312931a5a603203a1bb4903>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type commanderPage_CardEntries$data = {
  readonly cardEntries: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly id: string;
        readonly " $fragmentSpreads": FragmentRefs<"commanderPage_EntryCard">;
      };
    }>;
  };
  readonly id: string;
  readonly " $fragmentType": "commanderPage_CardEntries";
};
export type commanderPage_CardEntries$key = {
  readonly " $data"?: commanderPage_CardEntries$data;
  readonly " $fragmentSpreads": FragmentRefs<"commanderPage_CardEntries">;
};

import CommanderCardEntriesQuery_graphql from './CommanderCardEntriesQuery.graphql';

const node: ReaderFragment = (function(){
var v0 = [
  "cardEntries"
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "argumentDefinitions": [
    {
      "kind": "RootArgument",
      "name": "cardName"
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
      "name": "sortBy"
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
      "fragmentPathInResult": [
        "node"
      ],
      "operation": CommanderCardEntriesQuery_graphql,
      "identifierInfo": {
        "identifierField": "id",
        "identifierQueryVariableName": "id"
      }
    }
  },
  "name": "commanderPage_CardEntries",
  "selections": [
    {
      "alias": "cardEntries",
      "args": [
        {
          "kind": "Variable",
          "name": "cardName",
          "variableName": "cardName"
        },
        {
          "kind": "Variable",
          "name": "sortBy",
          "variableName": "sortBy"
        }
      ],
      "concreteType": "EntryConnection",
      "kind": "LinkedField",
      "name": "__commanderPage_cardEntries_connection",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "EntryEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "Entry",
              "kind": "LinkedField",
              "name": "node",
              "plural": false,
              "selections": [
                (v1/*: any*/),
                {
                  "args": null,
                  "kind": "FragmentSpread",
                  "name": "commanderPage_EntryCard"
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
    },
    (v1/*: any*/)
  ],
  "type": "Commander",
  "abstractKey": null
};
})();

(node as any).hash = "d736cf072ffad978ae94b284134828e0";

export default node;
