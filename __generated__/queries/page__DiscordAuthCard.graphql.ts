/**
 * @generated SignedSource<<ac4a8f8073dc453f5d757bdc132629e8>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type page__DiscordAuthCard$data = {
  readonly viewer: {
    readonly email: string | null | undefined;
    readonly image: string | null | undefined;
  } | null | undefined;
  readonly " $fragmentType": "page__DiscordAuthCard";
};
export type page__DiscordAuthCard$key = {
  readonly " $data"?: page__DiscordAuthCard$data;
  readonly " $fragmentSpreads": FragmentRefs<"page__DiscordAuthCard">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "page__DiscordAuthCard",
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

(node as any).hash = "56e7e6058e7915dca9d2a1e1c08a4550";

export default node;
