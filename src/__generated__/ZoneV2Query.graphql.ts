/* tslint:disable */
/* eslint-disable */
/* @relayHash 593550633e6edb34a523c38692191908 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ZoneV2QueryVariables = {
    codes: Array<string>;
};
export type ZoneV2QueryResponse = {
    readonly compare: {
        readonly " $fragmentRefs": FragmentRefs<"ZoneV2Root_data">;
    } | null;
};
export type ZoneV2Query = {
    readonly response: ZoneV2QueryResponse;
    readonly variables: ZoneV2QueryVariables;
};



/*
query ZoneV2Query(
  $codes: [String!]!
) {
  compare(codes: $codes) {
    ...ZoneV2Root_data
  }
}

fragment ZoneV2Root_data on CompareStats {
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
    "name": "ZoneV2Query",
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
            "name": "ZoneV2Root_data",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "ZoneV2Query",
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
    "name": "ZoneV2Query",
    "id": null,
    "text": "query ZoneV2Query(\n  $codes: [String!]!\n) {\n  compare(codes: $codes) {\n    ...ZoneV2Root_data\n  }\n}\n\nfragment ZoneV2Root_data on CompareStats {\n  zones {\n    code\n    slug\n    name\n    parentZone {\n      slug\n      code\n      name\n    }\n  }\n  totalCases {\n    zoneName\n    count\n    asOf\n  }\n  cumCases {\n    data\n    lineKeys\n    xAxisKey\n  }\n  newCases {\n    data\n    lineKeys\n    xAxisKey\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = 'a2e18b4df23746ce592394ea2260b61d';
export default node;
