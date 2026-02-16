/**
 * @generated SignedSource<<c3202bdd4d976f2b9f2c74a3dd7f5cc3>>
 * @relayHash 61816edf9bd7a5db8f9bc4e97c57074c
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 61816edf9bd7a5db8f9bc4e97c57074c

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type CoachingInfoInput = {
  coachingBio?: string | null | undefined;
  coachingBookingUrl?: string | null | undefined;
  coachingRatePerHour?: number | null | undefined;
  offersCoaching: boolean;
};
export type claimPage_UpdateCoachingProfileMutation$variables = {
  coachingInfo: CoachingInfoInput;
};
export type claimPage_UpdateCoachingProfileMutation$data = {
  readonly updateCoachingInfo: {
    readonly profile: {
      readonly " $fragmentSpreads": FragmentRefs<"claimPage_CoachingInfoCard">;
    } | null | undefined;
  } | null | undefined;
};
export type claimPage_UpdateCoachingProfileMutation = {
  response: claimPage_UpdateCoachingProfileMutation$data;
  variables: claimPage_UpdateCoachingProfileMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "coachingInfo"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "coachingInfo",
    "variableName": "coachingInfo"
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "claimPage_UpdateCoachingProfileMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "CoachingInfoResponse",
        "kind": "LinkedField",
        "name": "updateCoachingInfo",
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
                "args": null,
                "kind": "FragmentSpread",
                "name": "claimPage_CoachingInfoCard"
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
    "name": "claimPage_UpdateCoachingProfileMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "CoachingInfoResponse",
        "kind": "LinkedField",
        "name": "updateCoachingInfo",
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
                "name": "offersCoaching",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "coachingBio",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "coachingBookingUrl",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "coachingRatePerHour",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "id",
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
    "id": "61816edf9bd7a5db8f9bc4e97c57074c",
    "metadata": {},
    "name": "claimPage_UpdateCoachingProfileMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "6317bbc3fc73ece2e52933a502645ed6";

export default node;
