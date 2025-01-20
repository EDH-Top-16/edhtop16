/**
 * @generated SignedSource<<d3949fd0afc1de04b1d7b3e03ff62b0a>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment, RefetchableFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type Commander_entries$data = {
  readonly entries: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly id: string;
        readonly " $fragmentSpreads": FragmentRefs<"Commander_EntryCard">;
      };
    }>;
  };
  readonly id: string;
  readonly " $fragmentType": "Commander_entries";
};
export type Commander_entries$key = {
  readonly " $data"?: Commander_entries$data;
  readonly " $fragmentSpreads": FragmentRefs<"Commander_entries">;
};

const node: ReaderFragment = (function(){
var v0 = [
  "entries"
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
      "name": "maxStanding"
    },
    {
      "kind": "RootArgument",
      "name": "minEventSize"
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
      "fragmentPathInResult": [
        "node"
      ],
      "operation": require('./CommanderEntriesQuery.graphql'),
      "identifierInfo": {
        "identifierField": "id",
        "identifierQueryVariableName": "id"
      }
    }
  },
  "name": "Commander_entries",
  "selections": [
    {
      "alias": "entries",
      "args": [
        {
          "fields": [
            {
              "kind": "Variable",
              "name": "maxStanding",
              "variableName": "maxStanding"
            },
            {
              "kind": "Variable",
              "name": "minEventSize",
              "variableName": "minEventSize"
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
      "concreteType": "CommanderEntriesConnection",
      "kind": "LinkedField",
      "name": "__Commander_entries_connection",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "CommanderEntriesConnectionEdge",
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
                  "name": "Commander_EntryCard"
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

(node as any).hash = "dd5ecf026b227cd526752087b0600d9b";

export default node;
