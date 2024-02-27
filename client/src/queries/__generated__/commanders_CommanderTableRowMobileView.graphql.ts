/**
 * @generated SignedSource<<e2d99367a5142ab036450e853a62c994>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type commanders_CommanderTableRowMobileView$data = {
  readonly colorId: string;
  readonly conversionRate: number;
  readonly count: number;
  readonly name: string;
  readonly topCuts: number;
  readonly " $fragmentType": "commanders_CommanderTableRowMobileView";
};
export type commanders_CommanderTableRowMobileView$key = {
  readonly " $data"?: commanders_CommanderTableRowMobileView$data;
  readonly " $fragmentSpreads": FragmentRefs<"commanders_CommanderTableRowMobileView">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "commanders_CommanderTableRowMobileView",
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
      "name": "colorId",
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
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "count",
      "storageKey": null
    }
  ],
  "type": "Commander",
  "abstractKey": null
};

(node as any).hash = "bcaa2f261411640d6dc021922a672869";

export default node;
