/**
 * @generated SignedSource<<a40c01594a5f491e8fc18827f4382ae5>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { DisplayPreferences } from "../../src/lib/client/display_preferences";
import { FragmentRefs } from "relay-runtime";
export type DisplayPreferences____relay_model_instance$data = {
  readonly __relay_model_instance: DisplayPreferences;
  readonly " $fragmentType": "DisplayPreferences____relay_model_instance";
};
export type DisplayPreferences____relay_model_instance$key = {
  readonly " $data"?: DisplayPreferences____relay_model_instance$data;
  readonly " $fragmentSpreads": FragmentRefs<"DisplayPreferences____relay_model_instance">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "DisplayPreferences____relay_model_instance",
  "selections": [
    {
      "kind": "ClientExtension",
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "__relay_model_instance",
          "storageKey": null
        }
      ]
    }
  ],
  "type": "DisplayPreferences",
  "abstractKey": null
};

export default node;
