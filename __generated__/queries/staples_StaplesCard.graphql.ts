/**
 * @generated SignedSource<<eea91fca79cfe50dd72eb0059a50b6be>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type staples_StaplesCard$data = {
  readonly id: string;
  readonly imageUrls: ReadonlyArray<string>;
  readonly manaCost: string;
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

(node as any).hash = "e746ba74b89976aafaf6b62e6b5d77f0";

export default node;
