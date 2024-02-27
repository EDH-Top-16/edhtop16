/**
 * @generated SignedSource<<f838e5e5cc557d166d33b6517b16b9f4>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type commanders_CommandersQuery$variables = Record<PropertyKey, never>;
export type commanders_CommandersQuery$data = {
  readonly commanders: ReadonlyArray<{
    readonly " $fragmentSpreads": FragmentRefs<"commanders_CommandersTableData">;
  }>;
};
export type commanders_CommandersQuery = {
  response: commanders_CommandersQuery$data;
  variables: commanders_CommandersQuery$variables;
};

const node: ConcreteRequest = {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "commanders_CommandersQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Commander",
        "kind": "LinkedField",
        "name": "commanders",
        "plural": true,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "commanders_CommandersTableData"
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
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "commanders_CommandersQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Commander",
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
            "name": "topCuts",
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
            "name": "conversionRate",
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
            "name": "id",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "9b858d8e312f4a54faa8c0443e12f15a",
    "id": null,
    "metadata": {},
    "name": "commanders_CommandersQuery",
    "operationKind": "query",
    "text": "query commanders_CommandersQuery {\n  commanders {\n    ...commanders_CommandersTableData\n    id\n  }\n}\n\nfragment commanders_CommanderTableRow on Commander {\n  name\n  colorId\n  count\n  topCuts\n  conversionRate\n  ...commanders_CommanderTableRowMobileView\n}\n\nfragment commanders_CommanderTableRowMobileView on Commander {\n  name\n  colorId\n  topCuts\n  conversionRate\n  count\n}\n\nfragment commanders_CommandersTableData on Commander {\n  name\n  topCuts\n  count\n  conversionRate\n  ...commanders_CommanderTableRow\n}\n"
  }
};

(node as any).hash = "d8e3ca0b585246776158522be9fa821e";

export default node;
