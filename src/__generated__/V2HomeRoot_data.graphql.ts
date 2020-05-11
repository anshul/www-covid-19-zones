/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type V2HomeRoot_data = {
    readonly zones: ReadonlyArray<{
        readonly code: string;
        readonly name: string;
    }>;
    readonly " $refType": "V2HomeRoot_data";
};
export type V2HomeRoot_data$data = V2HomeRoot_data;
export type V2HomeRoot_data$key = {
    readonly " $data"?: V2HomeRoot_data$data;
    readonly " $fragmentRefs": FragmentRefs<"V2HomeRoot_data">;
};



const node: ReaderFragment = {
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
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "code",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "name",
          "args": null,
          "storageKey": null
        }
      ]
    }
  ]
};
(node as any).hash = '7e023c056504ca8234c1dc4488a803d5';
export default node;
