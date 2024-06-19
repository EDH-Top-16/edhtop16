/**
 * @generated SignedSource<<cbb16c3a1fe8513a5fb73bbb44945b85>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type commanders_CommandersTableData$data = ReadonlyArray<{
  readonly breakdownUrl: string;
  readonly colorId: string;
  readonly conversionRate: number;
  readonly count: number;
  readonly name: string;
  readonly topCuts: number;
  readonly " $fragmentType": "commanders_CommandersTableData";
}>;
export type commanders_CommandersTableData$key = ReadonlyArray<{
  readonly " $data"?: commanders_CommandersTableData$data;
  readonly " $fragmentSpreads": FragmentRefs<"commanders_CommandersTableData">;
}>;

const node: ReaderFragment = (function(){
var v0 = [
  {
    "kind": "Variable",
    "name": "filters",
    "variableName": "filters"
  }
];
return {
  "argumentDefinitions": [
    {
      "kind": "RootArgument",
      "name": "filters"
    }
  ],
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
      "args": (v0/*: any*/),
      "kind": "ScalarField",
      "name": "conversionRate",
      "storageKey": null
    },
    {
      "alias": null,
      "args": (v0/*: any*/),
      "kind": "ScalarField",
      "name": "count",
      "storageKey": null
    },
    {
      "alias": null,
      "args": (v0/*: any*/),
      "kind": "ScalarField",
      "name": "topCuts",
      "storageKey": null
    }
  ],
  "type": "Commander",
  "abstractKey": null
};
})();

(node as any).hash = "60ef5f0e70e60b23153031e850177c54";

export default node;
