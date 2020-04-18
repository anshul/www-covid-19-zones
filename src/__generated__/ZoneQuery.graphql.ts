/* tslint:disable */
/* eslint-disable */
/* @relayHash 404e8e4399db3a109b7dcedae05fe998 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ZoneQueryVariables = {
    code: string;
};
export type ZoneQueryResponse = {
    readonly zoneStats: {
        readonly " $fragmentRefs": FragmentRefs<"ZoneRoot_zoneStats">;
    };
};
export type ZoneQuery = {
    readonly response: ZoneQueryResponse;
    readonly variables: ZoneQueryVariables;
};



/*
query ZoneQuery(
  $code: String!
) {
  zoneStats(code: $code) {
    ...ZoneRoot_zoneStats
  }
}

fragment CustomLineChart_chart on LineChart {
  xAxisKey
  lineKeys
  data
}

fragment ZoneRoot_zoneStats on ZoneStats {
  zone {
    slug
  }
  newCases {
    ...CustomLineChart_chart
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "code",
    "type": "String!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "code",
    "variableName": "code"
  }
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "ZoneQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "zoneStats",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "ZoneStats",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "ZoneRoot_zoneStats",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "ZoneQuery",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "zoneStats",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "ZoneStats",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "zone",
            "storageKey": null,
            "args": null,
            "concreteType": "Zone",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "slug",
                "args": null,
                "storageKey": null
              }
            ]
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "newCases",
            "storageKey": null,
            "args": null,
            "concreteType": "LineChart",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "xAxisKey",
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
                "name": "data",
                "args": null,
                "storageKey": null
              }
            ]
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "ZoneQuery",
    "id": null,
    "text": "query ZoneQuery(\n  $code: String!\n) {\n  zoneStats(code: $code) {\n    ...ZoneRoot_zoneStats\n  }\n}\n\nfragment CustomLineChart_chart on LineChart {\n  xAxisKey\n  lineKeys\n  data\n}\n\nfragment ZoneRoot_zoneStats on ZoneStats {\n  zone {\n    slug\n  }\n  newCases {\n    ...CustomLineChart_chart\n  }\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = '81fed95ab96b4711ec1526a61010c5bc';
export default node;
