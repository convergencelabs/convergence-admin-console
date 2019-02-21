import React, {ReactNode} from "react";
import {Card, Tabs} from "antd";
import {Icon} from 'antd';
import styles from "./styles.module.css";
import {RouteComponentProps} from "react-router";
import {DomainId} from "../../../models/DomainId";
import {DomainBreadcrumbProducer} from "../DomainBreadcrumProducer";
import {Page} from "../../../components/common/Page";
import {toDomainUrl} from "../../../utils/domain-url";
import {DomainGeneralSettingsTab} from "./GeneralSettingsTab";
import {DomainMembers} from "./MemberSettingsTab";
import {DangerousSettings} from "./DangerSettingsTab";

export interface DomainSettingsProps extends RouteComponentProps<{tab: string}> {
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
    const tab = this.props.match.params.tab || "general";
    const baseUrl = toDomainUrl("", this.props.domainId, `settings`);
    return (
      <Page breadcrumbs={this._breadcrumbs}>
        <Card title={ <span><Icon type="setting"/> Settings</span>} className={styles.settingsCard}>
          <Tabs
            className={styles.tabs}
            type="card"
            defaultActiveKey={tab}
            onChange={key => {
              this.props.history.push(`${baseUrl}/${key}`);
            }}>
            <Tabs.TabPane tab="General" key="general">
              <DomainGeneralSettingsTab domainId={this.props.domainId}/>
            </Tabs.TabPane>
            <Tabs.TabPane tab="Members" key="members">
              <DomainMembers domainId={this.props.domainId} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Dangerous" key="dangerous">
              <DangerousSettings domainId={this.props.domainId} history={this.props.history}/>
            </Tabs.TabPane>
          </Tabs>
        </Card>
      </Page>
    );
  }
}
