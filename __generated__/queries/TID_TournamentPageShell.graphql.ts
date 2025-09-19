/**
 * @generated SignedSource<<bea6a9945d3a2683cdc8ec25f90bbed1>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type TID_TournamentPageShell$data = {
  readonly TID: string | null | undefined;
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

(node as any).hash = "9637977b21a7237a81b92f985599ee51";

export default node;
