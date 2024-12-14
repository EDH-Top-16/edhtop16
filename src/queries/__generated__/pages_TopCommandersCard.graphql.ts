/**
 * @generated SignedSource<<30ed4963a012e3bad0c3e496b64f78ee>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type pages_TopCommandersCard$data = {
  readonly breakdownUrl: string;
  readonly colorId: string;
  readonly imageUrls: ReadonlyArray<string>;
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
      "name": "imageUrls",
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
    }
  ],
  "type": "Commander",
  "abstractKey": null
};

(node as any).hash = "1611da4e9df45e8e8af41604cd7c55fe";

export default node;
