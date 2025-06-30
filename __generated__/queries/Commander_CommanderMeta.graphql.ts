/**
 * @generated SignedSource<<0d2301f3d4210c477ce576c46d045171>>
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
  "metadata": null,
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

(node as any).hash = "30d1d0da7b09f0de89b939fe1779a77d";

export default node;
