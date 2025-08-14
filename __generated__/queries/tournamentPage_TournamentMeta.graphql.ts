/**
 * @generated SignedSource<<8d786075c4e7b4d89bd181ded969b722>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type tournamentPage_TournamentMeta$data = {
  readonly name: string;
  readonly " $fragmentType": "tournamentPage_TournamentMeta";
};
export type tournamentPage_TournamentMeta$key = {
  readonly " $data"?: tournamentPage_TournamentMeta$data;
  readonly " $fragmentSpreads": FragmentRefs<"tournamentPage_TournamentMeta">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "tournamentPage_TournamentMeta",
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

(node as any).hash = "800300ed3f62bac9b999dee6b8d6849d";

export default node;
