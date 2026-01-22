/**
 * @generated SignedSource<<e88f5cce2d4fcb999460d80dcce27162>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type page_CommanderCommanderBanner$data = {
  readonly cards: ReadonlyArray<{
    readonly imageUrls: ReadonlyArray<string>;
  }>;
  readonly colorId: string;
  readonly name: string;
  readonly " $fragmentType": "page_CommanderCommanderBanner";
};
export type page_CommanderCommanderBanner$key = {
  readonly " $data"?: page_CommanderCommanderBanner$data;
  readonly " $fragmentSpreads": FragmentRefs<"page_CommanderCommanderBanner">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "throwOnFieldError": true
  },
  "name": "page_CommanderCommanderBanner",
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
    }
  ],
  "type": "Commander",
  "abstractKey": null
};

(node as any).hash = "be937018fb4f049016f3fba607782ec9";

export default node;
