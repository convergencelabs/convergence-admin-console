import React from "react";
import {CodeSnippet} from "../../../components/domain/common/CodeSnippet";

const DESCRIPTION = "This snippet demonstrates creating a presence list to observe user presence.";
const CODE = `
domain
  .presence()
  .subscribe("user1")
  .then((presence) => {
    presence.events().subscribe(event => console.log(event));
  }).catch((error) => {
    console.log("Could not subscribe to user, error);
  });`.trim();

export const PresenceSubscriptionSnippet: React.FunctionComponent<{}> = () => {
  return (<CodeSnippet code={CODE} description={DESCRIPTION} />);
}
