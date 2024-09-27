/**
 * @generated SignedSource<<b82acfc34fd781233fe857849a136a5b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
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
