/**
 * @generated SignedSource<<88f9a21c871f34fe7373a58cb6c2b323>>
 * @relayHash 5646c2326f13c39d3959404a9daa1414
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 5646c2326f13c39d3959404a9daa1414

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type claimPage_DeleteProfileMutation$variables = Record<PropertyKey, never>;
export type claimPage_DeleteProfileMutation$data = {
  readonly deleteProfile: {
    readonly error: string | null | undefined;
    readonly success: boolean | null | undefined;
    readonly viewer: {
      readonly " $fragmentSpreads": FragmentRefs<"claimPage_TopdeckProfileCard">;
    } | null | undefined;
  } | null | undefined;
};
export type claimPage_DeleteProfileMutation = {
  response: claimPage_DeleteProfileMutation$data;
  variables: claimPage_DeleteProfileMutation$variables;
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
    "name": "claimPage_DeleteProfileMutation",
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
                "name": "claimPage_TopdeckProfileCard"
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
    "name": "claimPage_DeleteProfileMutation",
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
    "id": "5646c2326f13c39d3959404a9daa1414",
    "metadata": {},
    "name": "claimPage_DeleteProfileMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "32f82b4e94c1eac132a733ffe1fdda73";

export default node;
