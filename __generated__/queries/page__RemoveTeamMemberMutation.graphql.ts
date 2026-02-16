/**
 * @generated SignedSource<<32c19997fce1ac12838975142ba814ec>>
 * @relayHash 3e65760d1c2c1763904186078ae64524
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 3e65760d1c2c1763904186078ae64524

import { ConcreteRequest } from 'relay-runtime';
export type page__RemoveTeamMemberMutation$variables = {
  teamId: string;
  topdeckProfileId: string;
};
export type page__RemoveTeamMemberMutation$data = {
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
export type page__RemoveTeamMemberMutation = {
  response: page__RemoveTeamMemberMutation$data;
  variables: page__RemoveTeamMemberMutation$variables;
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
    "name": "page__RemoveTeamMemberMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "page__RemoveTeamMemberMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "id": "3e65760d1c2c1763904186078ae64524",
    "metadata": {},
    "name": "page__RemoveTeamMemberMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "61e9325e2c622ad99e27def490ca6f79";

export default node;
