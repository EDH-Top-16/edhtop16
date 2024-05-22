/**
 * @generated SignedSource<<d3bcdf6bfc03a7e1e81b3106f32f355b>>
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
    "name": "minSize",
    "variableName": "minSize"
  }
];
return {
  "argumentDefinitions": [
    {
      "kind": "RootArgument",
      "name": "minSize"
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

(node as any).hash = "d4e3636e63352d83249ef57434dd4864";

export default node;
