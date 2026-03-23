/**
 * @generated SignedSource<<3dffc0e8ae724d70e7b51359d57eaf6d>>
 * @relayHash d5782d67a63a7f59445989a325020a96
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID d5782d67a63a7f59445989a325020a96

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type page_MonthlySeatWinRatesQuery$variables = Record<PropertyKey, never>;
export type page_MonthlySeatWinRatesQuery$data = {
  readonly monthlySeatWinRates: ReadonlyArray<{
    readonly id: string;
    readonly " $fragmentSpreads": FragmentRefs<"page_MonthlySeatWinRateChart" | "page_MonthlySeatWinRateRow">;
  }>;
};
export type page_MonthlySeatWinRatesQuery = {
  response: page_MonthlySeatWinRatesQuery$data;
  variables: page_MonthlySeatWinRatesQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
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
    "metadata": {
      "throwOnFieldError": true
    },
    "name": "page_MonthlySeatWinRatesQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "MonthlySeatWinRate",
        "kind": "LinkedField",
        "name": "monthlySeatWinRates",
        "plural": true,
        "selections": [
          (v0/*: any*/),
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "page_MonthlySeatWinRateRow"
          },
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "page_MonthlySeatWinRateChart"
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
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "page_MonthlySeatWinRatesQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "MonthlySeatWinRate",
        "kind": "LinkedField",
        "name": "monthlySeatWinRates",
        "plural": true,
        "selections": [
          (v0/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "month",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "games",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "seatWinRate1",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "seatWinRate2",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "seatWinRate3",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "seatWinRate4",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "drawRate",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "d5782d67a63a7f59445989a325020a96",
    "metadata": {},
    "name": "page_MonthlySeatWinRatesQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "d1747af3cd3a61bb370eee2e4ec85498";

import { PreloadableQueryRegistry } from 'relay-runtime';
PreloadableQueryRegistry.set(node.params.id, node);

export default node;
