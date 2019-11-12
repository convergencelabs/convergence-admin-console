/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import React from "react";
import {CodeSnippet} from "../../../components/domain/common/CodeSnippet";

const DESCRIPTION = `
This snippet demonstrates opening or creating a model using the openAutoCreate method. If the model
exists, it will be opened. If the model does not exist it will be created and then opened.
`.trim();

const CODE = `domain.models()
  .openAutoCreate({
    id: "my-model-id",
    collection: "my-collection",
    ephemeral: true,
    data: {
      "string": "test value",
      "number": 10,
      "boolean": true,
      "array": [
        "Apples",
        "Bananas",
        "Pears",
        "Orange"
      ],
      "object": {
        "key1": "value1",
        "key2": "value2",
        "key3": "value3",
        "key4": "value4"
      }
    }
  })
  .then((model) => {
    console.log("model open");
    // use the model
  })
  .catch((error) => {
    console.log("Could not open the model", error);
  });`

export const ModelOpenAutoCreate: React.FunctionComponent<{}> = () => {
  return (<CodeSnippet code={CODE} description={DESCRIPTION} />);
}

