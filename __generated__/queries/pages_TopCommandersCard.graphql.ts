/**
 * @generated SignedSource<<35895e93eee6126063dd1549ee5a8f96>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type pages_TopCommandersCard$data = {
  readonly breakdownUrl: string;
  readonly cards: ReadonlyArray<{
    readonly imageUrls: ReadonlyArray<string>;
  }>;
  readonly colorId: string;
  readonly name: string;
  readonly stats: {
    readonly conversionRate: number;
    readonly count: number;
    readonly metaShare: number;
    readonly topCuts: number;
  };
  readonly " $fragmentType": "pages_TopCommandersCard";
};
export type pages_TopCommandersCard$key = {
  readonly " $data"?: pages_TopCommandersCard$data;
  readonly " $fragmentSpreads": FragmentRefs<"pages_TopCommandersCard">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [
    {
      "kind": "RootArgument",
      "name": "minTournamentSize"
    },
    {
      "kind": "RootArgument",
      "name": "timePeriod"
    }
  ],
  "kind": "Fragment",
  "metadata": null,
  "name": "pages_TopCommandersCard",
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
      "name": "colorId",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "breakdownUrl",
      "storageKey": null
    },
    {
      "alias": null,
      "args": [
        {
          "fields": [
            {
              "kind": "Variable",
              "name": "minSize",
              "variableName": "minTournamentSize"
            },
            {
              "kind": "Variable",
              "name": "timePeriod",
              "variableName": "timePeriod"
            }
          ],
          "kind": "ObjectValue",
          "name": "filters"
        }
      ],
      "concreteType": "CommanderStats",
      "kind": "LinkedField",
      "name": "stats",
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
        }
      ],
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
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Commander",
  "abstractKey": null
};

(node as any).hash = "b689ba146c56ee09971ba19ce0438834";

export default node;
