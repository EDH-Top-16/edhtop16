/**
 * @generated SignedSource<<039ffc848014c8bbb3a25b6ad0d234d0>>
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

(node as any).hash = "cc05dee694c98fce3eb0cc551582a64b";

export default node;
