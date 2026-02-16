/**
 * @generated SignedSource<<10222fdb9af756c6daaf2d063277b5ac>>
 * @relayHash f8b36473bca2f2ba80bc14a0df31e719
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID f8b36473bca2f2ba80bc14a0df31e719

import { ConcreteRequest } from 'relay-runtime';
export type page__JoinTeamMutation$variables = {
  teamId: string;
};
export type page__JoinTeamMutation$data = {
  readonly selectTeam: {
    readonly profile: {
      readonly team: {
        readonly name: string | null | undefined;
      } | null | undefined;
    } | null | undefined;
  } | null | undefined;
};
export type page__JoinTeamMutation = {
  response: page__JoinTeamMutation$data;
  variables: page__JoinTeamMutation$variables;
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
    "name": "page__JoinTeamMutation",
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
    "name": "page__JoinTeamMutation",
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
    "id": "f8b36473bca2f2ba80bc14a0df31e719",
    "metadata": {},
    "name": "page__JoinTeamMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "110f4eb66b6cef7fbe59f21f1d20a4d7";

export default node;
