/**
 * @generated SignedSource<<5062b85e5d68aab15cfc169817514801>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type Commander_CommanderStaples$data = {
  readonly staples: ReadonlyArray<{
    readonly cmc: number;
    readonly colorId: string;
    readonly id: string;
    readonly imageUrls: ReadonlyArray<string>;
    readonly name: string;
    readonly playRateLastYear: number;
    readonly scryfallUrl: string;
    readonly type: string;
  }>;
  readonly " $fragmentType": "Commander_CommanderStaples";
};
export type Commander_CommanderStaples$key = {
  readonly " $data"?: Commander_CommanderStaples$data;
  readonly " $fragmentSpreads": FragmentRefs<"Commander_CommanderStaples">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "throwOnFieldError": true
  },
  "name": "Commander_CommanderStaples",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "Card",
      "kind": "LinkedField",
      "name": "staples",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "id",
          "storageKey": null
        },
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
          "name": "type",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "cmc",
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
          "name": "scryfallUrl",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "playRateLastYear",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Commander",
  "abstractKey": null
};

(node as any).hash = "8600b0a1ebfc5bc0adc7d3b4b56fa821";

export default node;
