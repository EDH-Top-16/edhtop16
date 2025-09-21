/**
 * @generated SignedSource<<edc16955ec67d2def035f34f6934088b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type TID_TournamentMeta$data = {
  readonly name: string;
  readonly " $fragmentType": "TID_TournamentMeta";
};
export type TID_TournamentMeta$key = {
  readonly " $data"?: TID_TournamentMeta$data;
  readonly " $fragmentSpreads": FragmentRefs<"TID_TournamentMeta">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "throwOnFieldError": true
  },
  "name": "TID_TournamentMeta",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "name",
      "storageKey": null
    }
  ],
  "type": "Tournament",
  "abstractKey": null
};

(node as any).hash = "2d3ccfb6dac887ef3c8e6676a50fcae8";

export default node;
