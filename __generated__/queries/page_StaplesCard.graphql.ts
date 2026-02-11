/**
 * @generated SignedSource<<c139b5a19256070327bf0cf9da7cab0d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type page_StaplesCard$data = {
  readonly id: string;
  readonly imageUrls: ReadonlyArray<string>;
  readonly manaCost: string;
  readonly name: string;
  readonly playRateLastYear: number;
  readonly scryfallUrl: string;
  readonly type: string;
  readonly " $fragmentType": "page_StaplesCard";
};
export type page_StaplesCard$key = {
  readonly " $data"?: page_StaplesCard$data;
  readonly " $fragmentSpreads": FragmentRefs<"page_StaplesCard">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "throwOnFieldError": true
  },
  "name": "page_StaplesCard",
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

(node as any).hash = "729ceb3070c5fe008f902f54df56f3c4";

export default node;
