/**
 * @generated SignedSource<<82696adae1b2d33c23fbd1ff599c2754>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type tournaments_TournamentCard$data = {
  readonly TID: string | null | undefined;
  readonly entries: ReadonlyArray<{
    readonly commander: {
      readonly cards: ReadonlyArray<{
        readonly imageUrls: ReadonlyArray<string> | null | undefined;
      }> | null | undefined;
    } | null | undefined;
    readonly player: {
      readonly name: string | null | undefined;
    } | null | undefined;
  }> | null | undefined;
  readonly name: string | null | undefined;
  readonly size: number | null | undefined;
  readonly tournamentDate: string | null | undefined;
  readonly " $fragmentType": "tournaments_TournamentCard";
};
export type tournaments_TournamentCard$key = {
  readonly " $data"?: tournaments_TournamentCard$data;
  readonly " $fragmentSpreads": FragmentRefs<"tournaments_TournamentCard">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "tournaments_TournamentCard",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "TID",
      "storageKey": null
    },
    (v0/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "size",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "tournamentDate",
      "storageKey": null
    },
    {
      "alias": null,
      "args": [
        {
          "kind": "Literal",
          "name": "maxStanding",
          "value": 1
        }
      ],
      "concreteType": "Entry",
      "kind": "LinkedField",
      "name": "entries",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "Player",
          "kind": "LinkedField",
          "name": "player",
          "plural": false,
          "selections": [
            (v0/*: any*/)
          ],
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "Commander",
          "kind": "LinkedField",
          "name": "commander",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "Card",
              "kind": "LinkedField",
              "name": "cards",
              "plural": true,
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "imageUrls",
                  "storageKey": null
                }
              ],
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": "entries(maxStanding:1)"
    }
  ],
  "type": "Tournament",
  "abstractKey": null
};
})();

(node as any).hash = "3069c5ecd9ab738c24b7c22d13ba7b37";

export default node;
