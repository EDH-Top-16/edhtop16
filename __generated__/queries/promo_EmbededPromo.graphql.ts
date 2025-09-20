/**
 * @generated SignedSource<<66ffc0be623438b584495d04759b82bb>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type promo_EmbededPromo$data = {
  readonly backgroundImageUrl: string;
  readonly buttonText: string;
  readonly description: ReadonlyArray<string>;
  readonly href: string;
  readonly imageUrl: string | null | undefined;
  readonly title: string;
  readonly " $fragmentType": "promo_EmbededPromo";
};
export type promo_EmbededPromo$key = {
  readonly " $data"?: promo_EmbededPromo$data;
  readonly " $fragmentSpreads": FragmentRefs<"promo_EmbededPromo">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "throwOnFieldError": true
  },
  "name": "promo_EmbededPromo",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "title",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "description",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "buttonText",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "backgroundImageUrl",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "imageUrl",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "href",
      "storageKey": null
    }
  ],
  "type": "FirstPartyPromo",
  "abstractKey": null
};

(node as any).hash = "e3441ef4a9fcb3f5dfb23be9b1e747b3";

export default node;
