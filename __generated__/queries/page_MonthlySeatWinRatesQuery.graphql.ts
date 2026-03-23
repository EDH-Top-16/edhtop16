/**
 * @generated SignedSource<<5a92814c44f89a9881bcc56fa342990c>>
 * @relayHash ffa9c9bbfbe20765abb92699ee90016c
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID ffa9c9bbfbe20765abb92699ee90016c

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type TournamentPhase = "ALL_ROUNDS" | "FINALS" | "SWISS" | "TOP_CUT" | "%future added value";
export type page_MonthlySeatWinRatesQuery$variables = {
  commanderName?: string | null | undefined;
  phase?: TournamentPhase | null | undefined;
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
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "phase"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "commanderName",
    "variableName": "commanderName"
  },
  {
    "kind": "Variable",
    "name": "phase",
    "variableName": "phase"
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
    "id": "ffa9c9bbfbe20765abb92699ee90016c",
    "metadata": {},
    "name": "page_MonthlySeatWinRatesQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "7249fbd0b89444f9bf4d13ad6356733c";

import { PreloadableQueryRegistry } from 'relay-runtime';
PreloadableQueryRegistry.set(node.params.id, node);

export default node;
