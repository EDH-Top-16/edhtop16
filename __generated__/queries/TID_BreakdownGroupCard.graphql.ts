/**
 * @generated SignedSource<<3b2f249868ad5afc88ba918088471bad>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type TID_BreakdownGroupCard$data = {
  readonly commander: {
    readonly breakdownUrl: string | null | undefined;
    readonly cards: ReadonlyArray<{
      readonly imageUrls: ReadonlyArray<string> | null | undefined;
    }> | null | undefined;
    readonly colorId: string | null | undefined;
    readonly name: string | null | undefined;
  } | null | undefined;
  readonly conversionRate: number | null | undefined;
  readonly entries: number | null | undefined;
  readonly topCuts: number | null | undefined;
  readonly " $fragmentType": "TID_BreakdownGroupCard";
};
export type TID_BreakdownGroupCard$key = {
  readonly " $data"?: TID_BreakdownGroupCard$data;
  readonly " $fragmentSpreads": FragmentRefs<"TID_BreakdownGroupCard">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "TID_BreakdownGroupCard",
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

(node as any).hash = "19b52b92f2c615da9d95f00b486b5250";

export default node;
