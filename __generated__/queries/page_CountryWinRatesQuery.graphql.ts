/**
 * @generated SignedSource<<dd50b947e878dba82882ae23c0d51f02>>
 * @relayHash 1d41a8de89bcdf20e0d3b7cf78c9d575
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 1d41a8de89bcdf20e0d3b7cf78c9d575

import { ConcreteRequest } from 'relay-runtime';
export type page_CountryWinRatesQuery$variables = {
  minTournaments?: number | null | undefined;
};
export type page_CountryWinRatesQuery$data = {
  readonly countrySeatWinRates: ReadonlyArray<{
    readonly country: string | null | undefined;
    readonly drawRate: number | null | undefined;
    readonly seatWinRate1: number | null | undefined;
    readonly seatWinRate2: number | null | undefined;
    readonly seatWinRate3: number | null | undefined;
    readonly seatWinRate4: number | null | undefined;
    readonly tournaments: number | null | undefined;
  }> | null | undefined;
};
export type page_CountryWinRatesQuery = {
  response: page_CountryWinRatesQuery$data;
  variables: page_CountryWinRatesQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "minTournaments"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "minTournaments",
        "variableName": "minTournaments"
      }
    ],
    "concreteType": "CountrySeatWinRate",
    "kind": "LinkedField",
    "name": "countrySeatWinRates",
    "plural": true,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "country",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "tournaments",
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
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "page_CountryWinRatesQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "page_CountryWinRatesQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "id": "1d41a8de89bcdf20e0d3b7cf78c9d575",
    "metadata": {},
    "name": "page_CountryWinRatesQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "f121bdc0fff094826df97ced6e835f41";

import { PreloadableQueryRegistry } from 'relay-runtime';
PreloadableQueryRegistry.set(node.params.id, node);

export default node;
