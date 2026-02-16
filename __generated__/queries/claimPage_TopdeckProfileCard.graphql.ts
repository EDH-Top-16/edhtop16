/**
 * @generated SignedSource<<f72fb0f57a6dbed0216df17c9a1def37>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type claimPage_TopdeckProfileCard$data = {
  readonly profile: {
    readonly id: string;
    readonly name: string | null | undefined;
    readonly offersCoaching: boolean;
    readonly profileImage: string;
    readonly topdeckProfile: string;
    readonly username: string | null | undefined;
  } | null | undefined;
  readonly " $fragmentType": "claimPage_TopdeckProfileCard";
};
export type claimPage_TopdeckProfileCard$key = {
  readonly " $data"?: claimPage_TopdeckProfileCard$data;
  readonly " $fragmentSpreads": FragmentRefs<"claimPage_TopdeckProfileCard">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "throwOnFieldError": true
  },
  "name": "claimPage_TopdeckProfileCard",
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

(node as any).hash = "dd309e58460ed170d5b3e1a19ce5660c";

export default node;
