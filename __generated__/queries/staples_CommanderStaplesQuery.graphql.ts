/**
 * @generated SignedSource<<78c21dea5b4de7c0183d1f58ce009aa7>>
 * @relayHash d5c4bf720865081cde3d4c3696dc8183
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID d5c4bf720865081cde3d4c3696dc8183

import { ConcreteRequest } from 'relay-runtime';
export type staples_CommanderStaplesQuery$variables = {
  commander: string;
};
export type staples_CommanderStaplesQuery$data = {
  readonly commander: {
    readonly name: string;
    readonly staples: ReadonlyArray<{
      readonly id: string;
      readonly manaCost: string;
      readonly name: string;
      readonly playRateLastYear: number;
      readonly scryfallUrl: string;
      readonly type: string;
    }>;
  };
};
export type staples_CommanderStaplesQuery = {
  response: staples_CommanderStaplesQuery$data;
  variables: staples_CommanderStaplesQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "commander"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "name",
    "variableName": "commander"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "concreteType": "Card",
  "kind": "LinkedField",
  "name": "staples",
  "plural": true,
  "selections": [
    (v3/*: any*/),
    (v2/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "type",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "manaCost",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "scryfallUrl",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "playRateLastYear",
      "storageKey": null
    }
  ],
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": {
      "throwOnFieldError": true
    },
    "name": "staples_CommanderStaplesQuery",
    "selections": [
      {
        "kind": "RequiredField",
        "field": {
          "alias": null,
          "args": (v1/*: any*/),
          "concreteType": "Commander",
          "kind": "LinkedField",
          "name": "commander",
          "plural": false,
          "selections": [
            (v2/*: any*/),
            (v4/*: any*/)
          ],
          "storageKey": null
        },
        "action": "THROW"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "staples_CommanderStaplesQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Commander",
        "kind": "LinkedField",
        "name": "commander",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v4/*: any*/),
          (v3/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "d5c4bf720865081cde3d4c3696dc8183",
    "metadata": {},
    "name": "staples_CommanderStaplesQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "705e55b0bd382709717fe78cfbb7c72c";

import { PreloadableQueryRegistry } from 'relay-runtime';
PreloadableQueryRegistry.set(node.params.id, node);

export default node;
