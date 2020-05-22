/* tslint:disable */
/* eslint-disable */
/* @relayHash 4d082f76094e05bdf811c58769e1d3ec */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type V2HomeQueryVariables = {
    codes: Array<string>;
};
export type V2HomeQueryResponse = {
    readonly v2Stats: {
        readonly " $fragmentRefs": FragmentRefs<"V2HomeRoot_data">;
    };
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
    ...V2HomeRoot_data
  }
}

fragment V2HomeRoot_data on V2Stats {
  zones {
    code
    category
    pCategory
    name
    ...ZoneCard_zone
    unitCodes
    chart {
      dt
      newInf
      newInfSma5
      totInf
    }
    parent {
      code
      name
    }
  }
}

fragment ZoneCard_zone on V2Zone {
  code
  name
  fEstPopulation
  fEstPopulationYear
  perMillionInfections
  cumulativeInfections
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
  "name": "name",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "V2HomeQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "v2Stats",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "V2Stats",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "V2HomeRoot_data",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "V2HomeQuery",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "v2Stats",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "V2Stats",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "zones",
            "storageKey": null,
            "args": null,
            "concreteType": "V2Zone",
            "plural": true,
            "selections": [
              (v2/*: any*/),
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "category",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "pCategory",
                "args": null,
                "storageKey": null
              },
              (v3/*: any*/),
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "fEstPopulation",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "fEstPopulationYear",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "perMillionInfections",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "cumulativeInfections",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "unitCodes",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "chart",
                "storageKey": null,
                "args": null,
                "concreteType": "TsPoint",
                "plural": true,
                "selections": [
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "dt",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "newInf",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "newInfSma5",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "totInf",
                    "args": null,
                    "storageKey": null
                  }
                ]
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "parent",
                "storageKey": null,
                "args": null,
                "concreteType": "V2Zone",
                "plural": false,
                "selections": [
                  (v2/*: any*/),
                  (v3/*: any*/)
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "V2HomeQuery",
    "id": null,
    "text": "query V2HomeQuery(\n  $codes: [String!]!\n) {\n  v2Stats(codes: $codes) {\n    ...V2HomeRoot_data\n  }\n}\n\nfragment V2HomeRoot_data on V2Stats {\n  zones {\n    code\n    category\n    pCategory\n    name\n    ...ZoneCard_zone\n    unitCodes\n    chart {\n      dt\n      newInf\n      newInfSma5\n      totInf\n    }\n    parent {\n      code\n      name\n    }\n  }\n}\n\nfragment ZoneCard_zone on V2Zone {\n  code\n  name\n  fEstPopulation\n  fEstPopulationYear\n  perMillionInfections\n  cumulativeInfections\n}\n",
    "metadata": {}
  }
};
})();
(node as any).hash = '7e232072b130bf3750142eb6e5cf92f9';
export default node;
