/**
 * @generated SignedSource<<09abc353da6fc0897508e1ccf66fcb4f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type page_CommanderCommanderMeta$data = {
  readonly name: string;
  readonly " $fragmentType": "page_CommanderCommanderMeta";
};
export type page_CommanderCommanderMeta$key = {
  readonly " $data"?: page_CommanderCommanderMeta$data;
  readonly " $fragmentSpreads": FragmentRefs<"page_CommanderCommanderMeta">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "throwOnFieldError": true
  },
  "name": "page_CommanderCommanderMeta",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "name",
      "storageKey": null
    }
  ],
  "type": "Commander",
  "abstractKey": null
};

(node as any).hash = "d2d17023ab741107deb98eb8888415bb";

export default node;
