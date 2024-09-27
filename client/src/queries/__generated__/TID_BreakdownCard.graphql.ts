/**
 * @generated SignedSource<<f6e2524fc93bd7d62a915c9ed4c63d08>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type TID_BreakdownCard$data = {
  readonly commander: {
    readonly breakdownUrl: string;
    readonly colorId: string;
    readonly imageUrls: ReadonlyArray<string>;
    readonly name: string;
  };
  readonly conversionRate: number;
  readonly entries: number;
  readonly topCuts: number;
  readonly " $fragmentType": "TID_BreakdownCard";
};
export type TID_BreakdownCard$key = {
  readonly " $data"?: TID_BreakdownCard$data;
  readonly " $fragmentSpreads": FragmentRefs<"TID_BreakdownCard">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "TID_BreakdownCard",
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
          "name": "imageUrls",
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

(node as any).hash = "dd3503badb78a476dc0c074c95b63074";

export default node;
