/**
 * @generated SignedSource<<1601ed19436b141de152ddcd023c662c>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type TID_TournamentMeta$data = {
  readonly name: string | null | undefined;
  readonly " $fragmentType": "TID_TournamentMeta";
};
export type TID_TournamentMeta$key = {
  readonly " $data"?: TID_TournamentMeta$data;
  readonly " $fragmentSpreads": FragmentRefs<"TID_TournamentMeta">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
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

(node as any).hash = "88bf0f66c617d32ab0b32cf4c75ffd10";

export default node;
