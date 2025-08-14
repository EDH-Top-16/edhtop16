/**
 * @generated SignedSource<<bd41284104c3ca6f1b03afa3c964f34a>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type tournamentPage_BreakdownGroupCard$data = {
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
  readonly " $fragmentType": "tournamentPage_BreakdownGroupCard";
};
export type tournamentPage_BreakdownGroupCard$key = {
  readonly " $data"?: tournamentPage_BreakdownGroupCard$data;
  readonly " $fragmentSpreads": FragmentRefs<"tournamentPage_BreakdownGroupCard">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "tournamentPage_BreakdownGroupCard",
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

(node as any).hash = "b4c14d4306138ecd2adeded646d16fb0";

export default node;
