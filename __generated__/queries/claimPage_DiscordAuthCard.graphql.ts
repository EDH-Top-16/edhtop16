/**
 * @generated SignedSource<<18054d59110355c9aedd90cdb02641c7>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type claimPage_DiscordAuthCard$data = {
  readonly viewer: {
    readonly email: string | null | undefined;
    readonly image: string | null | undefined;
  } | null | undefined;
  readonly " $fragmentType": "claimPage_DiscordAuthCard";
};
export type claimPage_DiscordAuthCard$key = {
  readonly " $data"?: claimPage_DiscordAuthCard$data;
  readonly " $fragmentSpreads": FragmentRefs<"claimPage_DiscordAuthCard">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "claimPage_DiscordAuthCard",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "Viewer",
      "kind": "LinkedField",
      "name": "viewer",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "email",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "image",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Query",
  "abstractKey": null
};

(node as any).hash = "3968ee0d320bb7a2c708973091548d83";

export default node;
