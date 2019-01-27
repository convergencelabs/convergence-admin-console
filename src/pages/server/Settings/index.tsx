import * as React from 'react';
import {Page} from "../../../components/Page/";
import {ReactNode} from "react";
import {BasicBreadcrumbsProducer} from "../../../stores/BreacrumStore";

export class Settings extends React.Component<{}, {}> {
  private readonly breadcrumbs = new BasicBreadcrumbsProducer([{title: "Settings"}]);
  render(): ReactNode {
    return (
      <Page breadcrumbs={this.breadcrumbs.breadcrumbs()}>
        <div>Settings</div>
      </Page>
    );
  }
}
