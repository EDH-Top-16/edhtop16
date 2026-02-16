/**
 * @generated SignedSource<<1d1664362918078733628ca00abacc03>>
 * @relayHash 903d9a20539abc5c4f9ba9681b8cb44c
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 903d9a20539abc5c4f9ba9681b8cb44c

import { ConcreteRequest } from 'relay-runtime';
export type claimPage_RemoveTeamMemberMutation$variables = {
  teamId: string;
  topdeckProfileId: string;
};
export type claimPage_RemoveTeamMemberMutation$data = {
  readonly removeTeamMember: {
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
export type claimPage_RemoveTeamMemberMutation = {
  response: claimPage_RemoveTeamMemberMutation$data;
  variables: claimPage_RemoveTeamMemberMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "teamId"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "topdeckProfileId"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "teamId",
        "variableName": "teamId"
      },
      {
        "kind": "Variable",
        "name": "topdeckProfileId",
        "variableName": "topdeckProfileId"
      }
    ],
    "concreteType": "TeamMemberResponse",
    "kind": "LinkedField",
    "name": "removeTeamMember",
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "claimPage_RemoveTeamMemberMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "claimPage_RemoveTeamMemberMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "id": "903d9a20539abc5c4f9ba9681b8cb44c",
    "metadata": {},
    "name": "claimPage_RemoveTeamMemberMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "c71a1d2cfa7a94f4c31df149dea58998";

export default node;
