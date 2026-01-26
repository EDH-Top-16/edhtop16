/**
 * @generated SignedSource<<0369267e437a1700d1c97e8f0b1e2efb>>
 * @relayHash aa45bd6d36601daccdc44b989db646d5
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID aa45bd6d36601daccdc44b989db646d5

import { ConcreteRequest } from 'relay-runtime';
export type TimePeriod = "ALL_TIME" | "ONE_MONTH" | "ONE_YEAR" | "POST_BAN" | "SIX_MONTHS" | "THREE_MONTHS" | "%future added value";
export type StatsQuery$variables = {
  commander: string;
  minEventSize?: number | null | undefined;
  timePeriod?: TimePeriod | null | undefined;
};
export type StatsQuery$data = {
  readonly commander: {
    readonly stats: {
      readonly conversionRate: number;
      readonly count: number;
      readonly metaShare: number;
    };
  };
};
export type StatsQuery = {
  response: StatsQuery$data;
  variables: StatsQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "commander"
},
v1 = {
  "defaultValue": 60,
  "kind": "LocalArgument",
  "name": "minEventSize"
},
v2 = {
  "defaultValue": "ONE_YEAR",
  "kind": "LocalArgument",
  "name": "timePeriod"
},
v3 = [
  {
    "kind": "Variable",
    "name": "name",
    "variableName": "commander"
  }
],
v4 = {
  "alias": null,
  "args": [
    {
      "fields": [
        {
          "kind": "Variable",
          "name": "minSize",
          "variableName": "minEventSize"
        },
        {
          "kind": "Variable",
          "name": "timePeriod",
          "variableName": "timePeriod"
        }
      ],
      "kind": "ObjectValue",
      "name": "filters"
    }
  ],
  "concreteType": "CommanderCalculatedStats",
  "kind": "LinkedField",
  "name": "stats",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "conversionRate",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "metaShare",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "count",
      "storageKey": null
    }
  ],
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": {
      "throwOnFieldError": true
    },
    "name": "StatsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": "Commander",
        "kind": "LinkedField",
        "name": "commander",
        "plural": false,
        "selections": [
          (v4/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v2/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Operation",
    "name": "StatsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": "Commander",
        "kind": "LinkedField",
        "name": "commander",
        "plural": false,
        "selections": [
          (v4/*: any*/),
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
    "id": "aa45bd6d36601daccdc44b989db646d5",
    "metadata": {},
    "name": "StatsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "1988d8a0b54fde78940cf028b480e3d7";

import { PreloadableQueryRegistry } from 'relay-runtime';
PreloadableQueryRegistry.set(node.params.id, node);

export default node;
