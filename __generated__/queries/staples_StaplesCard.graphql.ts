/**
 * @generated SignedSource<<b2dae274052656a44823c558784024f5>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type staples_StaplesCard$data = {
  readonly cmc: number;
  readonly colorId: string;
  readonly id: string;
  readonly imageUrls: ReadonlyArray<string>;
  readonly name: string;
  readonly playRateLastYear: number;
  readonly scryfallUrl: string;
  readonly type: string;
  readonly " $fragmentType": "staples_StaplesCard";
};
export type staples_StaplesCard$key = {
  readonly " $data"?: staples_StaplesCard$data;
  readonly " $fragmentSpreads": FragmentRefs<"staples_StaplesCard">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "throwOnFieldError": true
  },
  "name": "staples_StaplesCard",
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
  "type": "Card",
  "abstractKey": null
};

(node as any).hash = "9336bf8f75151f4bcffd929409014dfa";

export default node;
