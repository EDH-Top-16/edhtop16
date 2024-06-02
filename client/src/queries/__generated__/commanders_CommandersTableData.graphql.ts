/**
 * @generated SignedSource<<09293d1239f2372d71e34b0236d035fe>>
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
      "args": (v0/*: any*/),
      "kind": "ScalarField",
      "name": "topCuts",
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
})();

(node as any).hash = "9aa36ff41488b4b7216c1a841b500d0a";

export default node;
