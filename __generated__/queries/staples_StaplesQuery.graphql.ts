/**
 * @generated SignedSource<<ecf9fde32d54f9e5dc474db34fa5d427>>
 * @relayHash e4e676a53204c1d4f815b1136e8c3206
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID e4e676a53204c1d4f815b1136e8c3206

import { ConcreteRequest } from 'relay-runtime';
export type staples_StaplesQuery$variables = {
  colorId?: string | null | undefined;
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
    "id": "e4e676a53204c1d4f815b1136e8c3206",
    "metadata": {},
    "name": "staples_StaplesQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "3b4b11a5b56edc73fdc5daf6c3586608";

import { PreloadableQueryRegistry } from 'relay-runtime';
PreloadableQueryRegistry.set(node.params.id, node);

export default node;
