/**
 * @generated SignedSource<<e50240d50b32520c3b9169901c4c3d91>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type commanders_CommanderTableRowMobileView$data = {
  readonly colorID: string | null | undefined;
  readonly conversionRate: number | null | undefined;
  readonly count: number | null | undefined;
  readonly name: string;
  readonly topCuts: number | null | undefined;
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
      "name": "colorID",
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
  "type": "CommanderType",
  "abstractKey": null
};

(node as any).hash = "2fa38d0ec6a6189892a284df5ce4b9c4";

export default node;
