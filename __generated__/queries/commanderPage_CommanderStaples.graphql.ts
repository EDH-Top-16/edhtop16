/**
 * @generated SignedSource<<15a5bce0a761d36f2898570cbbf3324c>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type commanderPage_CommanderStaples$data = {
  readonly name: string;
  readonly staples: ReadonlyArray<{
    readonly cmc: number;
    readonly colorId: string;
    readonly id: string;
    readonly imageUrls: ReadonlyArray<string>;
    readonly name: string;
    readonly playRateLastYear: number;
    readonly scryfallUrl: string;
    readonly type: string;
  }>;
  readonly " $fragmentType": "commanderPage_CommanderStaples";
};
export type commanderPage_CommanderStaples$key = {
  readonly " $data"?: commanderPage_CommanderStaples$data;
  readonly " $fragmentSpreads": FragmentRefs<"commanderPage_CommanderStaples">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "throwOnFieldError": true
  },
  "name": "commanderPage_CommanderStaples",
  "selections": [
    (v0/*: any*/),
    {
      "alias": null,
      "args": null,
      "concreteType": "Card",
      "kind": "LinkedField",
      "name": "staples",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "id",
          "storageKey": null
        },
        (v0/*: any*/),
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "type",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "cmc",
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
          "args": null,
          "kind": "ScalarField",
          "name": "scryfallUrl",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "playRateLastYear",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Commander",
  "abstractKey": null
};
})();

(node as any).hash = "f5dc075928763cdf8f849b6ee7637e6c";

export default node;
