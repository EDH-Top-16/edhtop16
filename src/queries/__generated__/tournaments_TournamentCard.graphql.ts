/**
 * @generated SignedSource<<3a75e0bfe2a256ea17771d392c5f0769>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type tournaments_TournamentCard$data = {
  readonly TID: string;
  readonly entries: ReadonlyArray<{
    readonly commander: {
      readonly imageUrls: ReadonlyArray<string>;
    };
    readonly player: {
      readonly name: string;
    } | null | undefined;
  }>;
  readonly name: string;
  readonly size: number;
  readonly tournamentDate: string;
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
              "kind": "ScalarField",
              "name": "imageUrls",
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

(node as any).hash = "0770d12017acb7ba389c1d21eee166aa";

export default node;
