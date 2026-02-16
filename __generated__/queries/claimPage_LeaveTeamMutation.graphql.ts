/**
 * @generated SignedSource<<7682cbbf055f84f8bdffaee4df60e176>>
 * @relayHash eb9536a5997374c169144bb177508493
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID eb9536a5997374c169144bb177508493

import { ConcreteRequest } from 'relay-runtime';
export type claimPage_LeaveTeamMutation$variables = Record<PropertyKey, never>;
export type claimPage_LeaveTeamMutation$data = {
  readonly removeSelfFromTeam: {
    readonly profile: {
      readonly team: {
        readonly name: string | null | undefined;
      } | null | undefined;
    } | null | undefined;
  } | null | undefined;
};
export type claimPage_LeaveTeamMutation = {
  response: claimPage_LeaveTeamMutation$data;
  variables: claimPage_LeaveTeamMutation$variables;
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
    "name": "claimPage_LeaveTeamMutation",
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
    "name": "claimPage_LeaveTeamMutation",
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
    "id": "eb9536a5997374c169144bb177508493",
    "metadata": {},
    "name": "claimPage_LeaveTeamMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "62303d85b81284653c3d03fb070c60bc";

export default node;
