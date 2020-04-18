/* tslint:disable */
/* eslint-disable */
/* @relayHash 8e35bb221dab02ea3e12dedee43b0d69 */

import { ConcreteRequest } from "relay-runtime";
export type SearchbarQueryVariables = {
    searchQuery?: string | null;
};
export type SearchbarQueryResponse = {
    readonly zonesList: ReadonlyArray<{
        readonly slug: string;
        readonly name: string;
        readonly code: string;
        readonly parentZone: {
            readonly name: string;
        } | null;
    }>;
};
export type SearchbarQuery = {
    readonly response: SearchbarQueryResponse;
    readonly variables: SearchbarQueryVariables;
};



/*
query SearchbarQuery(
  $searchQuery: String
) {
  zonesList(searchQuery: $searchQuery) {
    slug
    name
    code
    parentZone {
      name
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "searchQuery",
    "type": "String",
    "defaultValue": null
  }
],
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v2 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "zonesList",
    "storageKey": null,
    "args": [
      {
        "kind": "Variable",
        "name": "searchQuery",
        "variableName": "searchQuery"
      }
    ],
    "concreteType": "Zone",
    "plural": true,
    "selections": [
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "slug",
        "args": null,
        "storageKey": null
      },
      (v1/*: any*/),
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "code",
        "args": null,
        "storageKey": null
      },
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "parentZone",
        "storageKey": null,
        "args": null,
        "concreteType": "Zone",
        "plural": false,
        "selections": [
          (v1/*: any*/)
        ]
      }
    ]
  }
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "SearchbarQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v2/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "SearchbarQuery",
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v2/*: any*/)
  },
  "params": {
    "operationKind": "query",
    "name": "SearchbarQuery",
    "id": null,
    "text": "query SearchbarQuery(\n  $searchQuery: String\n) {\n  zonesList(searchQuery: $searchQuery) {\n    slug\n    name\n    code\n    parentZone {\n      name\n    }\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = '27e0386c722126dc5a5dc86d6b1160e1';
export default node;
