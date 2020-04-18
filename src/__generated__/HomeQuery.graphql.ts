/* tslint:disable */
/* eslint-disable */
/* @relayHash a71c1038349b3fcf3d6972f8e3c54aed */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type HomeQueryVariables = {};
export type HomeQueryResponse = {
    readonly home: {
        readonly " $fragmentRefs": FragmentRefs<"HomeRoot_home">;
    };
};
export type HomeQuery = {
    readonly response: HomeQueryResponse;
    readonly variables: HomeQueryVariables;
};



/*
query HomeQuery {
  home {
    ...HomeRoot_home
  }
}

fragment HomeRoot_home on HomeData {
  cases {
    edges {
      node {
        label
        name
        value
      }
    }
  }
}
*/

const node: ConcreteRequest = {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "HomeQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "home",
        "storageKey": null,
        "args": null,
        "concreteType": "HomeData",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "HomeRoot_home",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "HomeQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "home",
        "storageKey": null,
        "args": null,
        "concreteType": "HomeData",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "cases",
            "storageKey": null,
            "args": null,
            "concreteType": "CasesConnection",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "edges",
                "storageKey": null,
                "args": null,
                "concreteType": "CasesEdge",
                "plural": true,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "node",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "Cases",
                    "plural": false,
                    "selections": [
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "label",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "name",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "value",
                        "args": null,
                        "storageKey": null
                      }
                    ]
                  }
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
    "name": "HomeQuery",
    "id": null,
    "text": "query HomeQuery {\n  home {\n    ...HomeRoot_home\n  }\n}\n\nfragment HomeRoot_home on HomeData {\n  cases {\n    edges {\n      node {\n        label\n        name\n        value\n      }\n    }\n  }\n}\n",
    "metadata": {}
  }
};
(node as any).hash = '4a625b78946e2ba46589915eb0f8682f';
export default node;
