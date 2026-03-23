/**
 * @generated SignedSource<<1aebe287dc01f13944ee41b7a5297c6a>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type page__TopdeckProfileCard$data = {
  readonly profile: {
    readonly id: string;
    readonly name: string | null | undefined;
    readonly offersCoaching: boolean;
    readonly profileImage: string;
    readonly topdeckProfile: string;
    readonly username: string | null | undefined;
  } | null | undefined;
  readonly " $fragmentType": "page__TopdeckProfileCard";
};
export type page__TopdeckProfileCard$key = {
  readonly " $data"?: page__TopdeckProfileCard$data;
  readonly " $fragmentSpreads": FragmentRefs<"page__TopdeckProfileCard">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "throwOnFieldError": true
  },
  "name": "page__TopdeckProfileCard",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "Profile",
      "kind": "LinkedField",
      "name": "profile",
      "plural": false,
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
          "name": "username",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "topdeckProfile",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "profileImage",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "offersCoaching",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Viewer",
  "abstractKey": null
};

(node as any).hash = "43f66962492dad73a8ea561b128280b2";

export default node;
