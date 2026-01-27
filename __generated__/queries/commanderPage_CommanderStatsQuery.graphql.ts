/**
 * @generated SignedSource<<c2089ef143a3f53ab5ea91aafbb2e948>>
 * @relayHash b7dc3c9d3c649c9d490a2c06a5f86c6c
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID b7dc3c9d3c649c9d490a2c06a5f86c6c

import { ConcreteRequest } from 'relay-runtime';
export type TimePeriod = "ALL_TIME" | "ONE_MONTH" | "ONE_YEAR" | "POST_BAN" | "SIX_MONTHS" | "THREE_MONTHS" | "%future added value";
export type commanderPage_CommanderStatsQuery$variables = {
  commander: string;
  minEventSize: number;
  timePeriod: TimePeriod;
};
export type commanderPage_CommanderStatsQuery$data = {
  readonly commander: {
    readonly stats: {
      readonly accessibilityCV: number | null | undefined;
      readonly count: number;
      readonly metaShare: number;
      readonly topCutFactor: number;
    };
  };
};
export type commanderPage_CommanderStatsQuery = {
  response: commanderPage_CommanderStatsQuery$data;
  variables: commanderPage_CommanderStatsQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "commander"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "minEventSize"
},
v2 = {
  "defaultValue": null,
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
      "name": "topCutFactor",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "accessibilityCV",
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
    "name": "commanderPage_CommanderStatsQuery",
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
    "name": "commanderPage_CommanderStatsQuery",
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
    "id": "b7dc3c9d3c649c9d490a2c06a5f86c6c",
    "metadata": {},
    "name": "commanderPage_CommanderStatsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "9d15feb5e78a34b07892b83f2479135e";

import { PreloadableQueryRegistry } from 'relay-runtime';
PreloadableQueryRegistry.set(node.params.id, node);

export default node;
