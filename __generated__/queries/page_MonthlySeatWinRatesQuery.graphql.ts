/**
 * @generated SignedSource<<ca5bf3154ca78216a73af6b66d260bbf>>
 * @relayHash eb971ac06eaab0afbbfe3231deb343c7
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID eb971ac06eaab0afbbfe3231deb343c7

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type page_MonthlySeatWinRatesQuery$variables = {
  commanderName?: string | null | undefined;
};
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
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "commanderName"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "commanderName",
    "variableName": "commanderName"
  }
],
v2 = {
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
    "metadata": {
      "throwOnFieldError": true
    },
    "name": "page_MonthlySeatWinRatesQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "MonthlySeatWinRate",
        "kind": "LinkedField",
        "name": "monthlySeatWinRates",
        "plural": true,
        "selections": [
          (v2/*: any*/),
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "page_MonthlySeatWinRatesQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "MonthlySeatWinRate",
        "kind": "LinkedField",
        "name": "monthlySeatWinRates",
        "plural": true,
        "selections": [
          (v2/*: any*/),
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
    "id": "eb971ac06eaab0afbbfe3231deb343c7",
    "metadata": {},
    "name": "page_MonthlySeatWinRatesQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "f8f2f24c4ec29acce09c62f3ff761ef3";

import { PreloadableQueryRegistry } from 'relay-runtime';
PreloadableQueryRegistry.set(node.params.id, node);

export default node;
