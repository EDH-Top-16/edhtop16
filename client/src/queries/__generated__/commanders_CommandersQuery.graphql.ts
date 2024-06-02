/**
 * @generated SignedSource<<48a67cafd1aa540e6143fb88ac88d0df>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type Filters = {
  colorId?: string | null | undefined;
  minDate?: string | null | undefined;
  minEntries?: number | null | undefined;
  minSize?: number | null | undefined;
  topCut?: number | null | undefined;
};
export type commanders_CommandersQuery$variables = {
  filters?: Filters | null | undefined;
};
export type commanders_CommandersQuery$data = {
  readonly commanders: ReadonlyArray<{
    readonly " $fragmentSpreads": FragmentRefs<"commanders_CommandersTableData">;
  }>;
};
export type commanders_CommandersQuery = {
  response: commanders_CommandersQuery$data;
  variables: commanders_CommandersQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "filters"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "filters",
    "variableName": "filters"
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "commanders_CommandersQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "commanders_CommandersQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
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
            "args": (v1/*: any*/),
            "kind": "ScalarField",
            "name": "topCuts",
            "storageKey": null
          },
          {
            "alias": null,
            "args": (v1/*: any*/),
            "kind": "ScalarField",
            "name": "count",
            "storageKey": null
          },
          {
            "alias": null,
            "args": (v1/*: any*/),
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
    "cacheID": "83fb0a337a6609743ddfbf8571795f25",
    "id": null,
    "metadata": {},
    "name": "commanders_CommandersQuery",
    "operationKind": "query",
    "text": "query commanders_CommandersQuery(\n  $filters: Filters\n) {\n  commanders(filters: $filters) {\n    ...commanders_CommandersTableData\n    id\n  }\n}\n\nfragment commanders_CommanderTableRow on Commander {\n  name\n  colorId\n  count(filters: $filters)\n  topCuts(filters: $filters)\n  conversionRate(filters: $filters)\n}\n\nfragment commanders_CommandersTableData on Commander {\n  name\n  topCuts(filters: $filters)\n  count(filters: $filters)\n  conversionRate(filters: $filters)\n  ...commanders_CommanderTableRow\n}\n"
  }
};
})();

(node as any).hash = "c096d0d469518b6550e05e9045211855";

export default node;
