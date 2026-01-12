/**
 * @generated SignedSource<<f78099ca242539cdedd50692cf32053f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type tournamentView_TournamentMeta$data = {
  readonly name: string;
  readonly " $fragmentType": "tournamentView_TournamentMeta";
};
export type tournamentView_TournamentMeta$key = {
  readonly " $data"?: tournamentView_TournamentMeta$data;
  readonly " $fragmentSpreads": FragmentRefs<"tournamentView_TournamentMeta">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "throwOnFieldError": true
  },
  "name": "tournamentView_TournamentMeta",
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

(node as any).hash = "eeeaec988dfcb8a5d4d584a63e1359dc";

export default node;
