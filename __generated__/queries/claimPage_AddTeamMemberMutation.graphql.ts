/**
 * @generated SignedSource<<3d939febedfe39b44f818d366ce95915>>
 * @relayHash 76ed787e4236e9c205ad873c6f91f34b
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 76ed787e4236e9c205ad873c6f91f34b

import { ConcreteRequest } from 'relay-runtime';
export type claimPage_AddTeamMemberMutation$variables = {
  profileUrl: string;
  teamId: string;
};
export type claimPage_AddTeamMemberMutation$data = {
  readonly addTeamMember: {
    readonly team: {
      readonly id: string;
      readonly invites: ReadonlyArray<{
        readonly joined: boolean | null | undefined;
        readonly name: string | null | undefined;
        readonly profileImage: string | null | undefined;
        readonly topdeckProfile: string | null | undefined;
        readonly username: string | null | undefined;
      }> | null | undefined;
    } | null | undefined;
  } | null | undefined;
};
export type claimPage_AddTeamMemberMutation = {
  response: claimPage_AddTeamMemberMutation$data;
  variables: claimPage_AddTeamMemberMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "profileUrl"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "teamId"
},
v2 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "profileUrl",
        "variableName": "profileUrl"
      },
      {
        "kind": "Variable",
        "name": "teamId",
        "variableName": "teamId"
      }
    ],
    "concreteType": "TeamMemberResponse",
    "kind": "LinkedField",
    "name": "addTeamMember",
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
            "concreteType": "TeamMemberInvite",
            "kind": "LinkedField",
            "name": "invites",
            "plural": true,
            "selections": [
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
                "name": "profileImage",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "joined",
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
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "claimPage_AddTeamMemberMutation",
    "selections": (v2/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "claimPage_AddTeamMemberMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "id": "76ed787e4236e9c205ad873c6f91f34b",
    "metadata": {},
    "name": "claimPage_AddTeamMemberMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "cc0cb5d96cf37663b7fc1f75371e2c06";

export default node;
