/**
 * @generated SignedSource<<7ad9f0b6c6d248c30929382dd958f43b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type commandersPage_TopCommandersCard$data = {
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
  readonly " $fragmentType": "commandersPage_TopCommandersCard";
};
export type commandersPage_TopCommandersCard$key = {
  readonly " $data"?: commandersPage_TopCommandersCard$data;
  readonly " $fragmentSpreads": FragmentRefs<"commandersPage_TopCommandersCard">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "commandersPage_TopCommandersCard",
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
      "args": null,
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

(node as any).hash = "c863f1ed0ba908db92dc5fa1d10dd623";

export default node;
