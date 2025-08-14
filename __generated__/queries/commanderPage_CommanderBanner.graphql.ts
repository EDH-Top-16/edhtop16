/**
 * @generated SignedSource<<58008595300b66e716d5dba005c39961>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type commanderPage_CommanderBanner$data = {
  readonly cards: ReadonlyArray<{
    readonly imageUrls: ReadonlyArray<string>;
  }>;
  readonly colorId: string;
  readonly name: string;
  readonly stats: {
    readonly conversionRate: number;
    readonly count: number;
    readonly metaShare: number;
    readonly topCutBias: number;
    readonly topCuts: number;
  };
  readonly " $fragmentType": "commanderPage_CommanderBanner";
};
export type commanderPage_CommanderBanner$key = {
  readonly " $data"?: commanderPage_CommanderBanner$data;
  readonly " $fragmentSpreads": FragmentRefs<"commanderPage_CommanderBanner">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "commanderPage_CommanderBanner",
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
    }
  ],
  "type": "Commander",
  "abstractKey": null
};

(node as any).hash = "8f267e8fdffb98a61eb8f2e34706c33c";

export default node;
