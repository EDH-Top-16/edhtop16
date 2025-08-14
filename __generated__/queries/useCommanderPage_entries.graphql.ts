/**
 * @generated SignedSource<<68e9a9870da1edef086b9a38231769f7>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type useCommanderPage_entries$data = {
  readonly entries: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly id: string;
        readonly " $fragmentSpreads": FragmentRefs<"commanderPage_EntryCard">;
      };
    }>;
  };
  readonly filteredStats: {
    readonly conversionRate: number;
    readonly count: number;
    readonly metaShare: number;
    readonly topCutBias: number;
    readonly topCuts: number;
  };
  readonly id: string;
  readonly " $fragmentType": "useCommanderPage_entries";
};
export type useCommanderPage_entries$key = {
  readonly " $data"?: useCommanderPage_entries$data;
  readonly " $fragmentSpreads": FragmentRefs<"useCommanderPage_entries">;
};

import CommanderEntriesQuery_graphql from './CommanderEntriesQuery.graphql';

const node: ReaderFragment = (function(){
var v0 = [
  "entries"
],
v1 = [
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
v2 = {
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
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "maxStanding"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "minEventSize"
    },
    {
      "kind": "RootArgument",
      "name": "sortBy"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
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
      "operation": CommanderEntriesQuery_graphql,
      "identifierInfo": {
        "identifierField": "id",
        "identifierQueryVariableName": "id"
      }
    }
  },
  "name": "useCommanderPage_entries",
  "selections": [
    {
      "alias": null,
      "args": (v1/*: any*/),
      "concreteType": "CommanderStats",
      "kind": "LinkedField",
      "name": "filteredStats",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "conversionRate",
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
          "name": "count",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "metaShare",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "topCutBias",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": "entries",
      "args": [
        {
          "fields": (v1/*: any*/),
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
                (v2/*: any*/),
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
    (v2/*: any*/)
  ],
  "type": "Commander",
  "abstractKey": null
};
})();

(node as any).hash = "0cefb27bfbaa5fa75d3a4b6a4bed9bdb";

export default node;
