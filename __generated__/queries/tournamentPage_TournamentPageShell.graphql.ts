/**
 * @generated SignedSource<<6c805c680dc5d6aafb414b6c81503d3d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type tournamentPage_TournamentPageShell$data = {
  readonly TID: string;
  readonly promo: {
    readonly " $fragmentSpreads": FragmentRefs<"promo_EmbededPromo">;
  } | null | undefined;
  readonly " $fragmentSpreads": FragmentRefs<"tournamentPage_TournamentBanner" | "tournamentPage_TournamentMeta">;
  readonly " $fragmentType": "tournamentPage_TournamentPageShell";
};
export type tournamentPage_TournamentPageShell$key = {
  readonly " $data"?: tournamentPage_TournamentPageShell$data;
  readonly " $fragmentSpreads": FragmentRefs<"tournamentPage_TournamentPageShell">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "tournamentPage_TournamentPageShell",
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
      "name": "tournamentPage_TournamentBanner"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "tournamentPage_TournamentMeta"
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

(node as any).hash = "a048858e2cba1352165b92b69fcb5b0d";

export default node;
