/**
 * @generated SignedSource<<f2f2ca9a6706cbdf6d72112a758810be>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type commanders_CommanderTableRow$data = {
  readonly colorId: string;
  readonly conversionRate: number;
  readonly count: number;
  readonly name: string;
  readonly topCuts: number;
  readonly " $fragmentType": "commanders_CommanderTableRow";
};
export type commanders_CommanderTableRow$key = {
  readonly " $data"?: commanders_CommanderTableRow$data;
  readonly " $fragmentSpreads": FragmentRefs<"commanders_CommanderTableRow">;
};

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
  "metadata": null,
  "name": "commanders_CommanderTableRow",
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
    },
    {
      "alias": null,
      "args": (v0/*: any*/),
      "kind": "ScalarField",
      "name": "conversionRate",
      "storageKey": null
    }
  ],
  "type": "Commander",
  "abstractKey": null
};
})();

(node as any).hash = "892d693f752bbd4f95fff863c477ab75";

export default node;
