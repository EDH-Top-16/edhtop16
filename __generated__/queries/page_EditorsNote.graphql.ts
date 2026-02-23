/**
 * @generated SignedSource<<b05f7f963b153bace398d0c48c911bd3>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type page_EditorsNote$data = {
  readonly editorsNote: string | null | undefined;
  readonly " $fragmentType": "page_EditorsNote";
};
export type page_EditorsNote$key = {
  readonly " $data"?: page_EditorsNote$data;
  readonly " $fragmentSpreads": FragmentRefs<"page_EditorsNote">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "page_EditorsNote",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "editorsNote",
      "storageKey": null
    }
  ],
  "type": "Tournament",
  "abstractKey": null
};

(node as any).hash = "be1140275f642b5a25f8c9141631d29f";

export default node;
