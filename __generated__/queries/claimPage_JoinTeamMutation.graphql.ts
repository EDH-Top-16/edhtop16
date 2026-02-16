/**
 * @generated SignedSource<<cb2189f93f576a8860983454874bb6f5>>
 * @relayHash 0958e602905f754affb29f0674dd7b6b
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 0958e602905f754affb29f0674dd7b6b

import { ConcreteRequest } from 'relay-runtime';
export type claimPage_JoinTeamMutation$variables = {
  teamId: string;
};
export type claimPage_JoinTeamMutation$data = {
  readonly selectTeam: {
    readonly profile: {
      readonly team: {
        readonly name: string | null | undefined;
      } | null | undefined;
    } | null | undefined;
  } | null | undefined;
};
export type claimPage_JoinTeamMutation = {
  response: claimPage_JoinTeamMutation$data;
  variables: claimPage_JoinTeamMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "teamId"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "teamId",
    "variableName": "teamId"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "claimPage_JoinTeamMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "UpdateProfileResponse",
        "kind": "LinkedField",
        "name": "selectTeam",
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
                  (v2/*: any*/)
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "claimPage_JoinTeamMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "UpdateProfileResponse",
        "kind": "LinkedField",
        "name": "selectTeam",
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
                  (v2/*: any*/),
                  (v3/*: any*/)
                ],
                "storageKey": null
              },
              (v3/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "0958e602905f754affb29f0674dd7b6b",
    "metadata": {},
    "name": "claimPage_JoinTeamMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "724885ea70c845cbbed6a58f0d7d4093";

export default node;
