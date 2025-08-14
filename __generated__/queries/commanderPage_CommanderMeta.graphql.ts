/**
 * @generated SignedSource<<de10aee3cf764cdf1a2ab90416ad4a14>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type commanderPage_CommanderMeta$data = {
  readonly name: string;
  readonly " $fragmentType": "commanderPage_CommanderMeta";
};
export type commanderPage_CommanderMeta$key = {
  readonly " $data"?: commanderPage_CommanderMeta$data;
  readonly " $fragmentSpreads": FragmentRefs<"commanderPage_CommanderMeta">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "commanderPage_CommanderMeta",
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

(node as any).hash = "40a5155b8fd69daec529d9b84ebe3a3c";

export default node;
