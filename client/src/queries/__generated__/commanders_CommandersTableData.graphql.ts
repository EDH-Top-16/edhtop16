/**
 * @generated SignedSource<<3ac12375c52f2c906cff89a93e733e76>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type commanders_CommandersTableData$data = ReadonlyArray<{
  readonly conversionRate: number | null | undefined;
  readonly count: number | null | undefined;
  readonly name: string;
  readonly topCuts: number | null | undefined;
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
  "type": "CommanderType",
  "abstractKey": null
};

(node as any).hash = "c8f4d90c82470f49b91d92ddf6412a72";

export default node;
