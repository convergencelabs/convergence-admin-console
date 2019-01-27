import * as React from 'react';
import {Page} from "../../../components/Page/";
import {ReactNode} from "react";
import {BasicBreadcrumbsProducer} from "../../../stores/BreacrumStore";
import {Card, Icon} from "antd";

export class Domains extends React.Component<{}, {}> {
  private readonly breadcrumbs = new BasicBreadcrumbsProducer([{title: "Domains"}]);
  render(): ReactNode {
    return (
      <Page breadcrumbs={this.breadcrumbs.breadcrumbs()}>
        <Card title={<span><Icon type="database"/> Domains</span>}>
        </Card>
      </Page>
    );
  }
}
