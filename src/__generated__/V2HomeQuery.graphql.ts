/* tslint:disable */
/* eslint-disable */
/* @relayHash 6a0913fd51b94963b3d828c82673239d */

import { ConcreteRequest } from "relay-runtime";
export type V2HomeQueryVariables = {
    codes: Array<string>;
};
export type V2HomeQueryResponse = {
    readonly v2Stats: ReadonlyArray<{
        readonly code: string;
    }>;
};
export type V2HomeQuery = {
    readonly response: V2HomeQueryResponse;
    readonly variables: V2HomeQueryVariables;
};



/*
query V2HomeQuery(
  $codes: [String!]!
) {
  v2Stats(codes: $codes) {
    code
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "codes",
    "type": "[String!]!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "v2Stats",
    "storageKey": null,
    "args": [
      {
        "kind": "Variable",
        "name": "codes",
        "variableName": "codes"
      }
    ],
    "concreteType": "ZoneCache",
    "plural": true,
    "selections": [
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "code",
        "args": null,
        "storageKey": null
      }
    ]
  }
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "V2HomeQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "V2HomeQuery",
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "params": {
    "operationKind": "query",
    "name": "V2HomeQuery",
    "id": null,
    "text": "query V2HomeQuery(\n  $codes: [String!]!\n) {\n  v2Stats(codes: $codes) {\n    code\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = 'f7893d36dc690cf13a89fadb3185f900';
export default node;
