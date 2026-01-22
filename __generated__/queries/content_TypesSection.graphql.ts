/**
 * @generated SignedSource<<bab444d1b8ead304b58b68dbfb894b0e>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type content_TypesSection$data = ReadonlyArray<{
  readonly id: string;
  readonly name: string;
  readonly playRateLastYear: number;
  readonly type: string;
  readonly " $fragmentSpreads": FragmentRefs<"content_StaplesCard">;
  readonly " $fragmentType": "content_TypesSection";
}>;
export type content_TypesSection$key = ReadonlyArray<{
  readonly " $data"?: content_TypesSection$data;
  readonly " $fragmentSpreads": FragmentRefs<"content_TypesSection">;
}>;

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "plural": true,
    "throwOnFieldError": true
  },
  "name": "content_TypesSection",
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
      "name": "content_StaplesCard"
    }
  ],
  "type": "Card",
  "abstractKey": null
};

(node as any).hash = "341f6c1de09e6b3b1b74f1eaee4eb167";

export default node;
