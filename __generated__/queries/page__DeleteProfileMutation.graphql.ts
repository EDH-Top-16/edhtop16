/**
 * @generated SignedSource<<9e9b0a2fdf8ede116602fc54bd6eb91d>>
 * @relayHash 4843f57643f117e909e2a7ee88aba46e
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 4843f57643f117e909e2a7ee88aba46e

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type page__DeleteProfileMutation$variables = Record<PropertyKey, never>;
export type page__DeleteProfileMutation$data = {
  readonly deleteProfile: {
    readonly error: string | null | undefined;
    readonly success: boolean | null | undefined;
    readonly viewer: {
      readonly " $fragmentSpreads": FragmentRefs<"page__TopdeckProfileCard">;
    } | null | undefined;
  } | null | undefined;
};
export type page__DeleteProfileMutation = {
  response: page__DeleteProfileMutation$data;
  variables: page__DeleteProfileMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "success",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "error",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "page__DeleteProfileMutation",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "ClaimProfileResponse",
        "kind": "LinkedField",
        "name": "deleteProfile",
        "plural": false,
        "selections": [
          (v0/*: any*/),
          (v1/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Viewer",
            "kind": "LinkedField",
            "name": "viewer",
            "plural": false,
            "selections": [
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "page__TopdeckProfileCard"
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "page__DeleteProfileMutation",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "ClaimProfileResponse",
        "kind": "LinkedField",
        "name": "deleteProfile",
        "plural": false,
        "selections": [
          (v0/*: any*/),
          (v1/*: any*/),
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
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "4843f57643f117e909e2a7ee88aba46e",
    "metadata": {},
    "name": "page__DeleteProfileMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "ba16827684f67eec49a3427b14215ab6";

export default node;
