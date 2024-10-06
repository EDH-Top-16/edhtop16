/**
 * @generated SignedSource<<b98c1128ea373aeb38350050be7c1531>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type Commander_CommanderPageShell$data = {
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

(node as any).hash = "3fc26936931dc2db5aba9dbf00060409";

export default node;
