/**
 * @generated SignedSource<<7556a14cb5111a6c339ed4041a06591c>>
 * @relayHash 440f8188079970f64dc9b71ac5c39dcc
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 440f8188079970f64dc9b71ac5c39dcc

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type CoachingInfoInput = {
  coachingBio?: string | null | undefined;
  coachingBookingUrl?: string | null | undefined;
  coachingRatePerHour?: number | null | undefined;
  offersCoaching: boolean;
};
export type page__UpdateCoachingProfileMutation$variables = {
  coachingInfo: CoachingInfoInput;
};
export type page__UpdateCoachingProfileMutation$data = {
  readonly updateCoachingInfo: {
    readonly profile: {
      readonly " $fragmentSpreads": FragmentRefs<"page__CoachingInfoCard">;
    } | null | undefined;
  } | null | undefined;
};
export type page__UpdateCoachingProfileMutation = {
  response: page__UpdateCoachingProfileMutation$data;
  variables: page__UpdateCoachingProfileMutation$variables;
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
    "name": "page__UpdateCoachingProfileMutation",
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
                "name": "page__CoachingInfoCard"
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
    "name": "page__UpdateCoachingProfileMutation",
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
    "id": "440f8188079970f64dc9b71ac5c39dcc",
    "metadata": {},
    "name": "page__UpdateCoachingProfileMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "0da346b6cdc80a581e30d70c9963835b";

export default node;
