/**
 * @generated SignedSource<<734ae5121ba395ec126059b1b3a72c4d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type TID_TournamentPageShell$data = {
  readonly " $fragmentSpreads": FragmentRefs<"TID_TournamentBanner">;
  readonly " $fragmentType": "TID_TournamentPageShell";
};
export type TID_TournamentPageShell$key = {
  readonly " $data"?: TID_TournamentPageShell$data;
  readonly " $fragmentSpreads": FragmentRefs<"TID_TournamentPageShell">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "TID_TournamentPageShell",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "TID_TournamentBanner"
    }
  ],
  "type": "Tournament",
  "abstractKey": null
};

(node as any).hash = "eb97a214884b51e6b046b5d905e72c7a";

export default node;
