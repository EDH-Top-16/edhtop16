/**
 * @generated SignedSource<<bafd1f7794d6888a5bc8908d2380aea3>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type tournamentView_TournamentBanner$data = {
  readonly bracketUrl: string;
  readonly drawRate: number | null | undefined;
  readonly name: string;
  readonly seatWinRate1: number | null | undefined;
  readonly seatWinRate2: number | null | undefined;
  readonly seatWinRate3: number | null | undefined;
  readonly seatWinRate4: number | null | undefined;
  readonly size: number;
  readonly tournamentDate: string;
  readonly winner: ReadonlyArray<{
    readonly commander: {
      readonly cards: ReadonlyArray<{
        readonly imageUrls: ReadonlyArray<string>;
      }>;
    };
  }>;
  readonly " $fragmentType": "tournamentView_TournamentBanner";
};
export type tournamentView_TournamentBanner$key = {
  readonly " $data"?: tournamentView_TournamentBanner$data;
  readonly " $fragmentSpreads": FragmentRefs<"tournamentView_TournamentBanner">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "throwOnFieldError": true
  },
  "name": "tournamentView_TournamentBanner",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "name",
      "storageKey": null
    },
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
      "args": null,
      "kind": "ScalarField",
      "name": "bracketUrl",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "seatWinRate1",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "seatWinRate2",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "seatWinRate3",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "seatWinRate4",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "drawRate",
      "storageKey": null
    },
    {
      "alias": "winner",
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

(node as any).hash = "4feb26b3f52d89bd689d039b803b0fd5";

export default node;
