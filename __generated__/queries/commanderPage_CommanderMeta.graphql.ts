/**
 * @generated SignedSource<<d70643412ef61cf559e61cabcd1b215c>>
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
  "metadata": {
    "throwOnFieldError": true
  },
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

(node as any).hash = "700cce180ff48f0b49d80e6c86c84580";

export default node;
