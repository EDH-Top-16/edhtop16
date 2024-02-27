/**
 * @generated SignedSource<<499c944af312d75620237b59cfa88cdd>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type commanders_CommandersTableData$data = ReadonlyArray<{
  readonly conversionRate: number;
  readonly count: number;
  readonly name: string;
  readonly topCuts: number;
  readonly " $fragmentSpreads": FragmentRefs<"commanders_CommanderTableRow">;
  readonly " $fragmentType": "commanders_CommandersTableData";
}>;
export type commanders_CommandersTableData$key = ReadonlyArray<{
  readonly " $data"?: commanders_CommandersTableData$data;
  readonly " $fragmentSpreads": FragmentRefs<"commanders_CommandersTableData">;
}>;

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "plural": true
  },
  "name": "commanders_CommandersTableData",
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
      "name": "topCuts",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "count",
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
      "args": null,
      "kind": "FragmentSpread",
      "name": "commanders_CommanderTableRow"
    }
  ],
  "type": "Commander",
  "abstractKey": null
};

(node as any).hash = "129b02a8cbd2dc4f39f8853f4b2d1699";

export default node;
