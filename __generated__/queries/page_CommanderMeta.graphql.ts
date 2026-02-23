/**
 * @generated SignedSource<<8c46b87a67881eb520a050b9318a9909>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type page_CommanderMeta$data = {
  readonly name: string;
  readonly " $fragmentType": "page_CommanderMeta";
};
export type page_CommanderMeta$key = {
  readonly " $data"?: page_CommanderMeta$data;
  readonly " $fragmentSpreads": FragmentRefs<"page_CommanderMeta">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "throwOnFieldError": true
  },
  "name": "page_CommanderMeta",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "name",
      "storageKey": null
    }
  ],
  "type": "Commander",
  "abstractKey": null
};

(node as any).hash = "bd7f96b43f9fd9b76a52cfd464b91557";

export default node;
