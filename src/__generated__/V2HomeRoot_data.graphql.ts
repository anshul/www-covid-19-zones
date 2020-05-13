/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type V2HomeRoot_data = {
    readonly zones: ReadonlyArray<{
        readonly code: string;
        readonly name: string;
        readonly chart: ReadonlyArray<{
            readonly dt: string;
            readonly newInf: number;
            readonly newInfSma5: number;
            readonly totInf: number;
        }>;
        readonly parent: {
            readonly code: string;
            readonly name: string;
        } | null;
    }>;
    readonly " $refType": "V2HomeRoot_data";
};
export type V2HomeRoot_data$data = V2HomeRoot_data;
export type V2HomeRoot_data$key = {
    readonly " $data"?: V2HomeRoot_data$data;
    readonly " $fragmentRefs": FragmentRefs<"V2HomeRoot_data">;
};



const node: ReaderFragment = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "code",
  "args": null,
  "storageKey": null
},
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Fragment",
  "name": "V2HomeRoot_data",
  "type": "V2Stats",
  "metadata": null,
  "argumentDefinitions": [],
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
        (v0/*: any*/),
        (v1/*: any*/),
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
            (v0/*: any*/),
            (v1/*: any*/)
          ]
        }
      ]
    }
  ]
};
})();
(node as any).hash = '09c0b5bf0b84d36572f931b1d3e009ed';
export default node;
