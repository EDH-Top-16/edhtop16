/**
 * @generated SignedSource<<1924fd57659aa03f3d2df71fdc66e52b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type Commander_CommanderBanner$data = {
  readonly colorId: string;
  readonly imageUrls: ReadonlyArray<string>;
  readonly name: string;
  readonly " $fragmentType": "Commander_CommanderBanner";
};
export type Commander_CommanderBanner$key = {
  readonly " $data"?: Commander_CommanderBanner$data;
  readonly " $fragmentSpreads": FragmentRefs<"Commander_CommanderBanner">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Commander_CommanderBanner",
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
      "name": "imageUrls",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "colorId",
      "storageKey": null
    }
  ],
  "type": "Commander",
  "abstractKey": null
};

(node as any).hash = "7eb6b03903ca978504215ad6ac44c53d";

export default node;
