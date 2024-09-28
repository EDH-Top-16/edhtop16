/**
 * @generated SignedSource<<130377c6b8a31b37ac30a88e558a3e00>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type TID_BreakdownGroupCard$data = {
  readonly commander: {
    readonly breakdownUrl: string;
    readonly colorId: string;
    readonly imageUrls: ReadonlyArray<string>;
    readonly name: string;
  };
  readonly conversionRate: number;
  readonly entries: number;
  readonly topCuts: number;
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

(node as any).hash = "2b71a671226cc3cb7f1a91a95a364e60";

export default node;
