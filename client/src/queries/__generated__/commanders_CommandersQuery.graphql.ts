/**
 * @generated SignedSource<<940c139e1326ed4d365964dade7f3668>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type commanders_CommandersQuery$variables = Record<PropertyKey, never>;
export type commanders_CommandersQuery$data = {
  readonly commanders: ReadonlyArray<{
    readonly colorID: string | null | undefined;
    readonly conversionRate: number | null | undefined;
    readonly count: number | null | undefined;
    readonly draws: number | null | undefined;
    readonly losses: number | null | undefined;
    readonly lossesBracket: number | null | undefined;
    readonly lossesSwiss: number | null | undefined;
    readonly name: string;
    readonly topCuts: number | null | undefined;
    readonly winRate: number | null | undefined;
    readonly winRateBracket: number | null | undefined;
    readonly winRateSwiss: number | null | undefined;
    readonly wins: number | null | undefined;
    readonly winsBracket: number | null | undefined;
    readonly winsSwiss: number | null | undefined;
  }>;
};
export type commanders_CommandersQuery = {
  response: commanders_CommandersQuery$data;
  variables: commanders_CommandersQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "CommanderType",
    "kind": "LinkedField",
    "name": "commanders",
    "plural": true,
    "selections": [
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
        "name": "colorID",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "wins",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "winsSwiss",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "winsBracket",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "draws",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "losses",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "lossesSwiss",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "lossesBracket",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "count",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "winRate",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "winRateSwiss",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "winRateBracket",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "topCuts",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "conversionRate",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "commanders_CommandersQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "commanders_CommandersQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "ed6ddd6195ce9b79df0334f64e13dc40",
    "id": null,
    "metadata": {},
    "name": "commanders_CommandersQuery",
    "operationKind": "query",
    "text": "query commanders_CommandersQuery {\n  commanders {\n    name\n    colorID\n    wins\n    winsSwiss\n    winsBracket\n    draws\n    losses\n    lossesSwiss\n    lossesBracket\n    count\n    winRate\n    winRateSwiss\n    winRateBracket\n    topCuts\n    conversionRate\n  }\n}\n"
  }
};
})();

(node as any).hash = "0813fedb012e182f2d938e8c1ca4bba8";

export default node;
