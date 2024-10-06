/**
 * @generated SignedSource<<e08371ce56e4789da4b20dd35c3aa114>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type TID_TournamentPageShell$data = {
  readonly " $fragmentSpreads": FragmentRefs<"TID_TournamentBanner" | "TID_TournamentMeta">;
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
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "TID_TournamentMeta"
    }
  ],
  "type": "Tournament",
  "abstractKey": null
};

(node as any).hash = "52a827dcee81558ef4631d28da44e851";

export default node;
