/**
 * @generated SignedSource<<09f9c8251ab08a6d296735a7f92db5b2>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type TID_TournamentPageShell$data = {
  readonly TID: string;
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
  "metadata": {
    "throwOnFieldError": true
  },
  "name": "TID_TournamentPageShell",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "TID",
      "storageKey": null
    },
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

(node as any).hash = "3a09b2f77284945ea8d7634301de5ab8";

export default node;
