/**
 * @generated SignedSource<<d016a153bd7d2dfb64ce16da52073ce4>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type tournamentView_EditorsNote$data = {
  readonly editorsNote: string | null | undefined;
  readonly " $fragmentType": "tournamentView_EditorsNote";
};
export type tournamentView_EditorsNote$key = {
  readonly " $data"?: tournamentView_EditorsNote$data;
  readonly " $fragmentSpreads": FragmentRefs<"tournamentView_EditorsNote">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "tournamentView_EditorsNote",
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

(node as any).hash = "634d17a80463d0992ee4c498e035d3c0";

export default node;
