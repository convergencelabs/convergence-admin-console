/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is part of the Convergence Server, which is released under
 * the terms of the GNU General Public License version 3 (GPLv3). A copy
 * of the GPLv3 should have been provided along with this file, typically
 * located in the "LICENSE" file, which is part of this source code package.
 * Alternatively, see <https://www.gnu.org/licenses/gpl-3.0.html> for the
 * full text of the GPLv3 license, if it was not provided.
 */

import React from "react";
import {CodeSnippet} from "../../../components/domain/common/CodeSnippet";

const DESCRIPTION = "This snippet demonstrates opening a model and working with the Realtime data model.";
const CODE = `
var modelId = "myModel";
domain.models
  .open(modelId)
  .then(model => {
    // the model is {firstName: “Fred”, lastName: “Flanders”}
    // A real time string
    const firstName = model.elementAt("firstName");

    firstName.on(Convergence.RealTimeString.Events.VALUE, evt => {
      console.log(firstName.value());
    });

    firstName.on(Convergence.RealTimeString.Events.INSERT, evt => {
      console.log(firstName.value());
    }); firstName.on(Convergence.RealTimeString.Events.REMOVE, evt => {
      console.log(firstName.value());
    });

    // Set the string's value
    firstName.value("Ted"); // "Ted", "change"

    // Delete the "T" at index 1
    firstName.remove(0, 1); // "ed", "change"

    // Insert an "N" at index 0.
    firstName.insert(0, "N"); // "Ned", "change"


    // Listen to course-grained events on the entire model
    model.root().on("model_changed", evt => {
      console.log("change");
    });
  });`.trim();

export const ModelDataSnippet: React.FunctionComponent<{}> = () => {
  return (<CodeSnippet code={CODE} description={DESCRIPTION} />);
}
