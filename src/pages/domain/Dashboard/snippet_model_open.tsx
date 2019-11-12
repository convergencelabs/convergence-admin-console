/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import React from "react";
import {CodeSnippet} from "../../../components/domain/common/CodeSnippet";

const DESCRIPTION = "This snippet demonstrates opening an existing model with a known model id.";
const CODE = `
const modelId = "my-model-id";
domain.models()
  .open(modelId)
  .then((model) => {
    console.log("model open");
    // use the model
  }).catch((error) => {
    console.log("Could not open the model", error);
  });`.trim();

export const ModelOpenSnippet: React.FunctionComponent<{}> = () => {
  return (<CodeSnippet code={CODE} description={DESCRIPTION} />);
}
