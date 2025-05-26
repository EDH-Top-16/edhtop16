/**
 * @generated SignedSource<<e509a64208708bcb9dc6c53bcad29ce0>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type TID_TournamentPageShell$data = {
  readonly promo: {
    readonly " $fragmentSpreads": FragmentRefs<"promo_EmbededPromo">;
  } | null | undefined;
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
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "FirstPartyPromo",
      "kind": "LinkedField",
      "name": "promo",
      "plural": false,
      "selections": [
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "promo_EmbededPromo"
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Tournament",
  "abstractKey": null
};

(node as any).hash = "8c49d9621fb731cf7263ceb345180a8e";

export default node;
