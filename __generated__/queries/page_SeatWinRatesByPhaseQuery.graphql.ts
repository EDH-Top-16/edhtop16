/**
 * @generated SignedSource<<342eafeb4bf87b45286b014dd96b22d2>>
 * @relayHash a28195a5113d7f38c0f31c07d73a018f
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID a28195a5113d7f38c0f31c07d73a018f

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type page_SeatWinRatesByPhaseQuery$variables = {
  tid: string;
};
export type page_SeatWinRatesByPhaseQuery$data = {
  readonly tournament: {
    readonly seatWinRatesByPhase: {
      readonly all: {
        readonly " $fragmentSpreads": FragmentRefs<"page_SeatWinRates">;
      };
      readonly finals: {
        readonly " $fragmentSpreads": FragmentRefs<"page_SeatWinRates">;
      };
      readonly swiss: {
        readonly " $fragmentSpreads": FragmentRefs<"page_SeatWinRates">;
      };
      readonly topCut: {
        readonly " $fragmentSpreads": FragmentRefs<"page_SeatWinRates">;
      };
    };
    readonly topCut: number;
  };
};
export type page_SeatWinRatesByPhaseQuery = {
  response: page_SeatWinRatesByPhaseQuery$data;
  variables: page_SeatWinRatesByPhaseQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "tid"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "TID",
    "variableName": "tid"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "topCut",
  "storageKey": null
},
v3 = [
  {
    "args": null,
    "kind": "FragmentSpread",
    "name": "page_SeatWinRates"
  }
],
v4 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "seat1",
    "storageKey": null
  },
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "seat2",
    "storageKey": null
  },
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "seat3",
    "storageKey": null
  },
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "seat4",
    "storageKey": null
  },
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "drawRate",
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": {
      "throwOnFieldError": true
    },
    "name": "page_SeatWinRatesByPhaseQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Tournament",
        "kind": "LinkedField",
        "name": "tournament",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "SeatWinRatesByPhase",
            "kind": "LinkedField",
            "name": "seatWinRatesByPhase",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "SeatWinRates",
                "kind": "LinkedField",
                "name": "all",
                "plural": false,
                "selections": (v3/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "SeatWinRates",
                "kind": "LinkedField",
                "name": "swiss",
                "plural": false,
                "selections": (v3/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "SeatWinRates",
                "kind": "LinkedField",
                "name": "topCut",
                "plural": false,
                "selections": (v3/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "SeatWinRates",
                "kind": "LinkedField",
                "name": "finals",
                "plural": false,
                "selections": (v3/*: any*/),
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "page_SeatWinRatesByPhaseQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Tournament",
        "kind": "LinkedField",
        "name": "tournament",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "SeatWinRatesByPhase",
            "kind": "LinkedField",
            "name": "seatWinRatesByPhase",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "SeatWinRates",
                "kind": "LinkedField",
                "name": "all",
                "plural": false,
                "selections": (v4/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "SeatWinRates",
                "kind": "LinkedField",
                "name": "swiss",
                "plural": false,
                "selections": (v4/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "SeatWinRates",
                "kind": "LinkedField",
                "name": "topCut",
                "plural": false,
                "selections": (v4/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "SeatWinRates",
                "kind": "LinkedField",
                "name": "finals",
                "plural": false,
                "selections": (v4/*: any*/),
                "storageKey": null
              }
            ],
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
    ]
  },
  "params": {
    "id": "a28195a5113d7f38c0f31c07d73a018f",
    "metadata": {},
    "name": "page_SeatWinRatesByPhaseQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "82471850730edeb1546cb5bf35a5b425";

export default node;
