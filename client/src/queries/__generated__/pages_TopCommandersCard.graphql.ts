/**
 * @generated SignedSource<<a687cbf0a57435c38d200409c81bfb7d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type pages_TopCommandersCard$data = {
  readonly breakdownUrl: string;
  readonly colorId: string;
  readonly conversionRate: number;
  readonly count: number;
  readonly imageUrls: ReadonlyArray<string>;
  readonly name: string;
  readonly topCuts: number;
  readonly " $fragmentType": "pages_TopCommandersCard";
};
export type pages_TopCommandersCard$key = {
  readonly " $data"?: pages_TopCommandersCard$data;
  readonly " $fragmentSpreads": FragmentRefs<"pages_TopCommandersCard">;
};

const node: ReaderFragment = (function(){
var v0 = [
  {
    "fields": [
      {
        "kind": "Variable",
        "name": "timePeriod",
        "variableName": "timePeriod"
      }
    ],
    "kind": "ObjectValue",
    "name": "filters"
  }
];
return {
  "argumentDefinitions": [
    {
      "kind": "RootArgument",
      "name": "timePeriod"
    }
  ],
  "kind": "Fragment",
  "metadata": null,
  "name": "pages_TopCommandersCard",
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
      "name": "imageUrls",
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
      "args": null,
      "kind": "ScalarField",
      "name": "breakdownUrl",
      "storageKey": null
    }
  ],
  "type": "Commander",
  "abstractKey": null
};
})();

(node as any).hash = "a8dea811c830457828eca4b9c745ea90";

export default node;
