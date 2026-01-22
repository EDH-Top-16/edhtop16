/**
 * @generated SignedSource<<84c9dd4ae8e7b764e1191c50cd71794a>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type content_StaplesCard$data = {
  readonly id: string;
  readonly imageUrls: ReadonlyArray<string>;
  readonly manaCost: string;
  readonly name: string;
  readonly playRateLastYear: number;
  readonly scryfallUrl: string;
  readonly type: string;
  readonly " $fragmentType": "content_StaplesCard";
};
export type content_StaplesCard$key = {
  readonly " $data"?: content_StaplesCard$data;
  readonly " $fragmentSpreads": FragmentRefs<"content_StaplesCard">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "throwOnFieldError": true
  },
  "name": "content_StaplesCard",
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
      "name": "manaCost",
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

(node as any).hash = "75a0499ed7a8a82fd7a053749a6ec44b";

export default node;
