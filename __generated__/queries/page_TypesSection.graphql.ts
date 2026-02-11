/**
 * @generated SignedSource<<2358db7a0bb389e80b5d67ebe21666f8>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type page_TypesSection$data = ReadonlyArray<{
  readonly id: string;
  readonly name: string;
  readonly playRateLastYear: number;
  readonly type: string;
  readonly " $fragmentSpreads": FragmentRefs<"page_StaplesCard">;
  readonly " $fragmentType": "page_TypesSection";
}>;
export type page_TypesSection$key = ReadonlyArray<{
  readonly " $data"?: page_TypesSection$data;
  readonly " $fragmentSpreads": FragmentRefs<"page_TypesSection">;
}>;

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "plural": true,
    "throwOnFieldError": true
  },
  "name": "page_TypesSection",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    },
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
      "name": "type",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "playRateLastYear",
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "page_StaplesCard"
    }
  ],
  "type": "Card",
  "abstractKey": null
};

(node as any).hash = "3f905a33434f570ae37d46cc6e6254ea";

export default node;
