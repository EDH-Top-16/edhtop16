/**
 * @generated SignedSource<<bcf9a122b3d9fa84034025d0342c0eb8>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type Commander_CommanderStaples$data = {
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
  readonly " $fragmentType": "Commander_CommanderStaples";
};
export type Commander_CommanderStaples$key = {
  readonly " $data"?: Commander_CommanderStaples$data;
  readonly " $fragmentSpreads": FragmentRefs<"Commander_CommanderStaples">;
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
  "name": "Commander_CommanderStaples",
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

(node as any).hash = "eec29da5196a66bc1b8a4c489f58ee62";

export default node;
