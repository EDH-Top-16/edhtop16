/**
 * @generated SignedSource<<62e7678b153dddfb717009a0c92432f8>>
 * @relayHash eac42a8a897017551aa4aabe650767d7
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID eac42a8a897017551aa4aabe650767d7

import { ConcreteRequest } from 'relay-runtime';
export type page__AddTeamMemberMutation$variables = {
  profileUrl: string;
  teamId: string;
};
export type page__AddTeamMemberMutation$data = {
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
export type page__AddTeamMemberMutation = {
  response: page__AddTeamMemberMutation$data;
  variables: page__AddTeamMemberMutation$variables;
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
    "name": "page__AddTeamMemberMutation",
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
    "name": "page__AddTeamMemberMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "id": "eac42a8a897017551aa4aabe650767d7",
    "metadata": {},
    "name": "page__AddTeamMemberMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "d45c2a93bb03a6175a68d21795c8ded1";

export default node;
