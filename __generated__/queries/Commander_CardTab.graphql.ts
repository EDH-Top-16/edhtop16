/**
 * @generated SignedSource<<56a5fddf4f9377d3afcbecf41f3af3ea>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type Commander_CardTab$data = {
  readonly cardDetails: {
    readonly card: {
      readonly cardPreviewImageUrl: string | null | undefined;
      readonly name: string | null | undefined;
      readonly scryfallUrl: string | null | undefined;
    } | null | undefined;
    readonly entries: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly id: string;
          readonly " $fragmentSpreads": FragmentRefs<"Commander_EntryCard">;
        } | null | undefined;
      }> | null | undefined;
    } | null | undefined;
    readonly winRateSeries: ReadonlyArray<{
      readonly periodStart: string | null | undefined;
      readonly winRateWithCard: number | null | undefined;
      readonly winRateWithoutCard: number | null | undefined;
      readonly withCount: number | null | undefined;
      readonly withoutCount: number | null | undefined;
    }> | null | undefined;
  } | null | undefined;
  readonly id: string;
  readonly " $fragmentType": "Commander_CardTab";
};
export type Commander_CardTab$key = {
  readonly " $data"?: Commander_CardTab$data;
  readonly " $fragmentSpreads": FragmentRefs<"Commander_CardTab">;
};

import CommanderCardEntriesQuery_graphql from './CommanderCardEntriesQuery.graphql';

const node: ReaderFragment = (function(){
var v0 = [
  "cardDetails",
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
      "defaultValue": null,
      "kind": "LocalArgument",
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
      "defaultValue": null,
      "kind": "LocalArgument",
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
      "operation": CommanderCardEntriesQuery_graphql,
      "identifierInfo": {
        "identifierField": "id",
        "identifierQueryVariableName": "id"
      }
    }
  },
  "name": "Commander_CardTab",
  "selections": [
    {
      "alias": null,
      "args": [
        {
          "kind": "Variable",
          "name": "cardName",
          "variableName": "cardName"
        },
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
      "concreteType": "CommanderCardDetails",
      "kind": "LinkedField",
      "name": "cardDetails",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "Card",
          "kind": "LinkedField",
          "name": "card",
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
              "name": "scryfallUrl",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "cardPreviewImageUrl",
              "storageKey": null
            }
          ],
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "CommanderCardWinRatePoint",
          "kind": "LinkedField",
          "name": "winRateSeries",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "periodStart",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "winRateWithCard",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "winRateWithoutCard",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "withCount",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "withoutCount",
              "storageKey": null
            }
          ],
          "storageKey": null
        },
        {
          "alias": "entries",
          "args": null,
          "concreteType": "EntryConnection",
          "kind": "LinkedField",
          "name": "__Commander_cardEntries__entries_connection",
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

(node as any).hash = "40d95f814537ebaf9786ff2ccc5b4c1d";

export default node;
