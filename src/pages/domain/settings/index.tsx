import React, {ReactNode} from "react";
import {Card, Tabs} from "antd";
import {Icon} from 'antd';
import styles from "./styles.module.css";
import {RouteComponentProps} from "react-router";
import {DomainId} from "../../../models/DomainId";
import {DomainBreadcrumbProducer} from "../DomainBreadcrumProducer";
import {Page} from "../../../components/common/Page";

export interface DomainSettingsProps extends RouteComponentProps {
  domainId: DomainId;
}

export class DomainSettings extends React.Component<DomainSettingsProps, {}> {
  private readonly _breadcrumbs: DomainBreadcrumbProducer;

  constructor(props: DomainSettingsProps) {
    super(props);

    this._breadcrumbs = new DomainBreadcrumbProducer(this.props.domainId, [
      {title: "Settings"}
    ]);
  }

  public render(): ReactNode {
    return (
      <Page breadcrumbs={this._breadcrumbs}>
        <Card title={ <span><Icon type="setting"/> Settings</span>} className={styles.formCard}>
          <Tabs className={styles.tabs} type="card">
            <Tabs.TabPane tab="General" key="general">

            </Tabs.TabPane>
            <Tabs.TabPane tab="Members" key="members">
            </Tabs.TabPane>

            <Tabs.TabPane tab="Dangerous" key="dangerous">
            </Tabs.TabPane>
          </Tabs>
        </Card>
      </Page>
    );
  }
}
