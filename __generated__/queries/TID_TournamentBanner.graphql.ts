/**
 * @generated SignedSource<<bead58307de6cfea3184a3aa070e0d9c>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type TID_TournamentBanner$data = {
  readonly bracketUrl: string;
  readonly name: string;
  readonly size: number;
  readonly tournamentDate: string;
  readonly winner: ReadonlyArray<{
    readonly commander: {
      readonly cards: ReadonlyArray<{
        readonly imageUrls: ReadonlyArray<string>;
      }>;
    };
  }>;
  readonly " $fragmentType": "TID_TournamentBanner";
};
export type TID_TournamentBanner$key = {
  readonly " $data"?: TID_TournamentBanner$data;
  readonly " $fragmentSpreads": FragmentRefs<"TID_TournamentBanner">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "TID_TournamentBanner",
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

(node as any).hash = "ef7b4750f82b28002be8207fafe048e4";

export default node;
