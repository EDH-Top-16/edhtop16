/**
 * @generated SignedSource<<2fc6618b6f80993419ff2d4544f794c5>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type tournamentView_BreakdownGroupCard$data = {
  readonly commander: {
    readonly breakdownUrl: string;
    readonly cards: ReadonlyArray<{
      readonly imageUrls: ReadonlyArray<string>;
    }>;
    readonly colorId: string;
    readonly name: string;
  };
  readonly conversionRate: number;
  readonly entries: number;
  readonly topCuts: number;
  readonly " $fragmentType": "tournamentView_BreakdownGroupCard";
};
export type tournamentView_BreakdownGroupCard$key = {
  readonly " $data"?: tournamentView_BreakdownGroupCard$data;
  readonly " $fragmentSpreads": FragmentRefs<"tournamentView_BreakdownGroupCard">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "throwOnFieldError": true
  },
  "name": "tournamentView_BreakdownGroupCard",
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
          "kind": "ScalarField",
          "name": "name",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "breakdownUrl",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "colorId",
          "storageKey": null
        },
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
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "entries",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "topCuts",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "conversionRate",
      "storageKey": null
    }
  ],
  "type": "TournamentBreakdownGroup",
  "abstractKey": null
};

(node as any).hash = "a48bbb671164e9e80ee694d7583cf997";

export default node;
