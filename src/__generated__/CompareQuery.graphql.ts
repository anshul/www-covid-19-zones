/* tslint:disable */
/* eslint-disable */
/* @relayHash a44b8a0f515276a4ee2ce050b2ef71d2 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type CompareQueryVariables = {
    codes: Array<string>;
};
export type CompareQueryResponse = {
    readonly compare: {
        readonly " $fragmentRefs": FragmentRefs<"CompareRoot_data">;
    } | null;
};
export type CompareQuery = {
    readonly response: CompareQueryResponse;
    readonly variables: CompareQueryVariables;
};



/*
query CompareQuery(
  $codes: [String!]!
) {
  compare(codes: $codes) {
    ...CompareRoot_data
  }
}

fragment CompareRoot_data on CompareStats {
  zones {
    code
    slug
    name
    parentZone {
      slug
      code
      name
    }
  }
  totalCases {
    zoneName
    count
    asOf
  }
  cumCases {
    data
    lineKeys
    xAxisKey
  }
  newCases {
    data
    lineKeys
    xAxisKey
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
    "kind": "Variable",
    "name": "codes",
    "variableName": "codes"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "code",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "slug",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v5 = [
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "data",
    "args": null,
    "storageKey": null
  },
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "lineKeys",
    "args": null,
    "storageKey": null
  },
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "xAxisKey",
    "args": null,
    "storageKey": null
  }
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "CompareQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "compare",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "CompareStats",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "CompareRoot_data",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "CompareQuery",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "compare",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "CompareStats",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "zones",
            "storageKey": null,
            "args": null,
            "concreteType": "Zone",
            "plural": true,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              (v4/*: any*/),
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "parentZone",
                "storageKey": null,
                "args": null,
                "concreteType": "Zone",
                "plural": false,
                "selections": [
                  (v3/*: any*/),
                  (v2/*: any*/),
                  (v4/*: any*/)
                ]
              }
            ]
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "totalCases",
            "storageKey": null,
            "args": null,
            "concreteType": "CaseCount",
            "plural": true,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "zoneName",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "count",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "asOf",
                "args": null,
                "storageKey": null
              }
            ]
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "cumCases",
            "storageKey": null,
            "args": null,
            "concreteType": "LineChart",
            "plural": false,
            "selections": (v5/*: any*/)
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "newCases",
            "storageKey": null,
            "args": null,
            "concreteType": "LineChart",
            "plural": false,
            "selections": (v5/*: any*/)
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "CompareQuery",
    "id": null,
    "text": "query CompareQuery(\n  $codes: [String!]!\n) {\n  compare(codes: $codes) {\n    ...CompareRoot_data\n  }\n}\n\nfragment CompareRoot_data on CompareStats {\n  zones {\n    code\n    slug\n    name\n    parentZone {\n      slug\n      code\n      name\n    }\n  }\n  totalCases {\n    zoneName\n    count\n    asOf\n  }\n  cumCases {\n    data\n    lineKeys\n    xAxisKey\n  }\n  newCases {\n    data\n    lineKeys\n    xAxisKey\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = '3551c4a4bf64c182d80764ef442ac565';
export default node;
