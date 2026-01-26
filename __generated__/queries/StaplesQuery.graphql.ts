/**
 * @generated SignedSource<<83574b320fd89b2b58e97c602387e43a>>
 * @relayHash 99fb95ea8e955894188900aec107cb55
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 99fb95ea8e955894188900aec107cb55

import { ConcreteRequest } from 'relay-runtime';
export type StaplesQuery$variables = {
  commander: string;
};
export type StaplesQuery$data = {
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
export type StaplesQuery = {
  response: StaplesQuery$data;
  variables: StaplesQuery$variables;
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
    "name": "StaplesQuery",
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "StaplesQuery",
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
    "id": "99fb95ea8e955894188900aec107cb55",
    "metadata": {},
    "name": "StaplesQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "155823f31d6a619f7b5971fa68ef93be";

import { PreloadableQueryRegistry } from 'relay-runtime';
PreloadableQueryRegistry.set(node.params.id, node);

export default node;
