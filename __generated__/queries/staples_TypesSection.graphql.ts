/**
 * @generated SignedSource<<57742273fd53d1e5cb4212b3d682b3af>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type staples_TypesSection$data = ReadonlyArray<{
  readonly id: string;
  readonly name: string;
  readonly playRateLastYear: number;
  readonly type: string;
  readonly " $fragmentSpreads": FragmentRefs<"staples_StaplesCard">;
  readonly " $fragmentType": "staples_TypesSection";
}>;
export type staples_TypesSection$key = ReadonlyArray<{
  readonly " $data"?: staples_TypesSection$data;
  readonly " $fragmentSpreads": FragmentRefs<"staples_TypesSection">;
}>;

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "plural": true,
    "throwOnFieldError": true
  },
  "name": "staples_TypesSection",
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
      "name": "staples_StaplesCard"
    }
  ],
  "type": "Card",
  "abstractKey": null
};

(node as any).hash = "e58bd7e142126d688f07fece4356968c";

export default node;
