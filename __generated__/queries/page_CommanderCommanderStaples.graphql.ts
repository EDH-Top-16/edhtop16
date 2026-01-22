/**
 * @generated SignedSource<<4ba8ba6836b3d47038694446d466438f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type page_CommanderCommanderStaples$data = {
  readonly name: string;
  readonly staples: ReadonlyArray<{
    readonly id: string;
    readonly manaCost: string;
    readonly name: string;
    readonly playRateLastYear: number;
    readonly scryfallUrl: string;
    readonly type: string;
  }>;
  readonly " $fragmentType": "page_CommanderCommanderStaples";
};
export type page_CommanderCommanderStaples$key = {
  readonly " $data"?: page_CommanderCommanderStaples$data;
  readonly " $fragmentSpreads": FragmentRefs<"page_CommanderCommanderStaples">;
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
  "name": "page_CommanderCommanderStaples",
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

(node as any).hash = "d1ec59f247cc3fe6b182e3fc320941b5";

export default node;
