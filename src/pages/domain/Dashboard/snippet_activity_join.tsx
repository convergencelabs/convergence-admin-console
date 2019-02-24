import React from "react";
import {CodeSnippet} from "../../../components/domain/common/CodeSnippet";

const DESCRIPTION = "This snippet demonstrates joining an existing activity.";
const CODE = `
const activityId = "myActivity";
domain.activities()
  .join(activityId)
  .then((activity) => {
    console.log("activity joined");
    // use the activity
  }).catch((error) => {
    console.log("Could not join the activity", error);
  });`.trim();

export const ActivityJoinSnippet: React.FunctionComponent<{}> = () => {
  return (<CodeSnippet code={CODE} description={DESCRIPTION} />);
}
