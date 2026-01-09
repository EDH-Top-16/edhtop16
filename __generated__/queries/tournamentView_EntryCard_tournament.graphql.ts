/**
 * @generated SignedSource<<1e689b65674c9a2cb4923c2d8c8c145c>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type tournamentView_EntryCard_tournament$data = {
  readonly size: number;
  readonly " $fragmentType": "tournamentView_EntryCard_tournament";
};
export type tournamentView_EntryCard_tournament$key = {
  readonly " $data"?: tournamentView_EntryCard_tournament$data;
  readonly " $fragmentSpreads": FragmentRefs<"tournamentView_EntryCard_tournament">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "throwOnFieldError": true
  },
  "name": "tournamentView_EntryCard_tournament",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "size",
      "storageKey": null
    }
  ],
  "type": "Tournament",
  "abstractKey": null
};

(node as any).hash = "e0a8deb68e021597f71721b5a81cb9f8";

export default node;
