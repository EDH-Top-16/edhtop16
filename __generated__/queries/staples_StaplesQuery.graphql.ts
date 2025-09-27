/**
 * @generated SignedSource<<e8e07a3b0e4885696d00e55b9e296eeb>>
 * @relayHash c918e0053b7f625df0212cb65bb99b67
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID c918e0053b7f625df0212cb65bb99b67

import { ConcreteRequest } from 'relay-runtime';
export type staples_StaplesQuery$variables = {
  colorId?: string | null | undefined;
  type?: string | null | undefined;
};
export type staples_StaplesQuery$data = {
  readonly staples: ReadonlyArray<{
    readonly cmc: number | null | undefined;
    readonly colorId: string | null | undefined;
    readonly id: string;
    readonly imageUrls: ReadonlyArray<string> | null | undefined;
    readonly name: string | null | undefined;
    readonly playRateLastYear: number | null | undefined;
    readonly scryfallUrl: string | null | undefined;
    readonly type: string | null | undefined;
  }> | null | undefined;
};
export type staples_StaplesQuery = {
  response: staples_StaplesQuery$data;
  variables: staples_StaplesQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "colorId"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "type"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "colorId",
        "variableName": "colorId"
      },
      {
        "kind": "Variable",
        "name": "type",
        "variableName": "type"
      }
    ],
    "concreteType": "Card",
    "kind": "LinkedField",
    "name": "staples",
    "plural": true,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
        "storageKey": null
      },
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
        "name": "type",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "cmc",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "colorId",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "imageUrls",
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
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "staples_StaplesQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "staples_StaplesQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "id": "c918e0053b7f625df0212cb65bb99b67",
    "metadata": {},
    "name": "staples_StaplesQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "34c041ce483a854df1767a9407fa17e3";

import { PreloadableQueryRegistry } from 'relay-runtime';
PreloadableQueryRegistry.set(node.params.id, node);

export default node;
