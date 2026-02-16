/**
 * @generated SignedSource<<455237900bd7eff79f2bb280d2e20728>>
 * @relayHash 3b3b3c3d70194223f5f7ef9e6abdc59c
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 3b3b3c3d70194223f5f7ef9e6abdc59c

import { ConcreteRequest } from 'relay-runtime';
export type page__LeaveTeamMutation$variables = Record<PropertyKey, never>;
export type page__LeaveTeamMutation$data = {
  readonly removeSelfFromTeam: {
    readonly profile: {
      readonly team: {
        readonly name: string | null | undefined;
      } | null | undefined;
    } | null | undefined;
  } | null | undefined;
};
export type page__LeaveTeamMutation = {
  response: page__LeaveTeamMutation$data;
  variables: page__LeaveTeamMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "page__LeaveTeamMutation",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "UpdateProfileResponse",
        "kind": "LinkedField",
        "name": "removeSelfFromTeam",
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
                "concreteType": "Team",
                "kind": "LinkedField",
                "name": "team",
                "plural": false,
                "selections": [
                  (v0/*: any*/)
                ],
                "storageKey": null
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
    "name": "page__LeaveTeamMutation",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "UpdateProfileResponse",
        "kind": "LinkedField",
        "name": "removeSelfFromTeam",
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
                "concreteType": "Team",
                "kind": "LinkedField",
                "name": "team",
                "plural": false,
                "selections": [
                  (v0/*: any*/),
                  (v1/*: any*/)
                ],
                "storageKey": null
              },
              (v1/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "3b3b3c3d70194223f5f7ef9e6abdc59c",
    "metadata": {},
    "name": "page__LeaveTeamMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "035a726343d54455e34e5e77fdd145c9";

export default node;
