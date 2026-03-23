/**
 * @generated SignedSource<<929556338a87ce0d709dd395491db577>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type page_TournamentMeta$data = {
  readonly name: string;
  readonly " $fragmentType": "page_TournamentMeta";
};
export type page_TournamentMeta$key = {
  readonly " $data"?: page_TournamentMeta$data;
  readonly " $fragmentSpreads": FragmentRefs<"page_TournamentMeta">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "throwOnFieldError": true
  },
  "name": "page_TournamentMeta",
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

(node as any).hash = "e3e1801d09a9f554893859736e4d6403";

export default node;
