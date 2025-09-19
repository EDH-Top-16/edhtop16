/**
 * @generated SignedSource<<c08edd78419003edb8933e8ab51e352e>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type Commander_CommanderMeta$data = {
  readonly name: string;
  readonly " $fragmentType": "Commander_CommanderMeta";
};
export type Commander_CommanderMeta$key = {
  readonly " $data"?: Commander_CommanderMeta$data;
  readonly " $fragmentSpreads": FragmentRefs<"Commander_CommanderMeta">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "throwOnFieldError": true
  },
  "name": "Commander_CommanderMeta",
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

(node as any).hash = "891cdbe4dd48758e53c23da88b8026d9";

export default node;
