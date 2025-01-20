/**
 * @generated SignedSource<<c5ff240faa334d175f9358d42ec38cab>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type Commander_CommanderPageShell$data = {
  readonly breakdownUrl: string;
  readonly " $fragmentSpreads": FragmentRefs<"Commander_CommanderBanner" | "Commander_CommanderMeta">;
  readonly " $fragmentType": "Commander_CommanderPageShell";
};
export type Commander_CommanderPageShell$key = {
  readonly " $data"?: Commander_CommanderPageShell$data;
  readonly " $fragmentSpreads": FragmentRefs<"Commander_CommanderPageShell">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Commander_CommanderPageShell",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "breakdownUrl",
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "Commander_CommanderBanner"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "Commander_CommanderMeta"
    }
  ],
  "type": "Commander",
  "abstractKey": null
};

(node as any).hash = "9ea4b9837d6e15890e35099032da7f4f";

export default node;
