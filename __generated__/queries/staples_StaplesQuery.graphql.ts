/**
 * @generated SignedSource<<0092a14fd5e3a35871b820738795c8cc>>
 * @relayHash 007bc969df126551752b76e97de065a3
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

// @relayRequestID 007bc969df126551752b76e97de065a3

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type staples_StaplesQuery$variables = {
  colorId?: string | null | undefined;
  type?: string | null | undefined;
};
export type staples_StaplesQuery$data = {
  readonly staples: ReadonlyArray<{
    readonly id: string;
    readonly " $fragmentSpreads": FragmentRefs<"staples_StaplesCard">;
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
    "metadata": null,
    "name": "staples_StaplesQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Card",
        "kind": "LinkedField",
        "name": "staples",
        "plural": true,
        "selections": [
          (v2/*: any*/),
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "staples_StaplesCard"
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
    "name": "staples_StaplesQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Card",
        "kind": "LinkedField",
        "name": "staples",
        "plural": true,
        "selections": [
          (v2/*: any*/),
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
    ]
  },
  "params": {
    "id": "007bc969df126551752b76e97de065a3",
    "metadata": {},
    "name": "staples_StaplesQuery",
    "operationKind": "query",
    "text": null
  }
};
})();

(node as any).hash = "9c48641feb3571ca3b2f64c22c23f78a";

import { PreloadableQueryRegistry } from 'relay-runtime';
PreloadableQueryRegistry.set(node.params.id, node);

export default node;
