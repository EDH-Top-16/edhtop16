/**
 * @generated SignedSource<<05ccfc62f6328f4081f7aabf8bb2a4b7>>
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
    readonly id: string;
    readonly manaCost: string;
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
          "name": "manaCost",
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

(node as any).hash = "dfc9e8d10e088d7f7f326092a36036fa";

export default node;
