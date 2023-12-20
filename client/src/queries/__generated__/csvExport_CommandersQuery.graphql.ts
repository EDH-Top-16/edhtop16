/**
 * @generated SignedSource<<16dd4012199667d75a003025643b01c9>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type csvExport_CommandersQuery$variables = Record<PropertyKey, never>;
export type csvExport_CommandersQuery$data = {
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
export type csvExport_CommandersQuery = {
  response: csvExport_CommandersQuery$data;
  variables: csvExport_CommandersQuery$variables;
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
    "name": "csvExport_CommandersQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "csvExport_CommandersQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "41128f423e57c571779be8d62272174d",
    "id": null,
    "metadata": {},
    "name": "csvExport_CommandersQuery",
    "operationKind": "query",
    "text": "query csvExport_CommandersQuery {\n  commanders {\n    name\n    colorID\n    wins\n    winsSwiss\n    winsBracket\n    draws\n    losses\n    lossesSwiss\n    lossesBracket\n    count\n    winRate\n    winRateSwiss\n    winRateBracket\n    topCuts\n    conversionRate\n  }\n}\n"
  }
};
})();

(node as any).hash = "22b3194371e8035c20cba0b24c829615";

export default node;
