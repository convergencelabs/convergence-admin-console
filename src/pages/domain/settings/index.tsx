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

import React, {ReactNode} from "react";
import {SettingOutlined} from '@ant-design/icons';
import {Card, Tabs} from "antd";
import styles from "./styles.module.css";
import {RouteComponentProps} from "react-router";
import {DomainId} from "../../../models/DomainId";
import {Page} from "../../../components";
import {toDomainRoute} from "../../../utils/domain-url";
import {DomainGeneralSettingsTab} from "./GeneralSettingsTab";
import {DomainMembers} from "./MemberSettingsTab";
import {DangerousSettings} from "./DangerSettingsTab";
import {DomainModelSettingsTab} from "./ModelSettingsTab";
import {DomainCollectionSettingsTab} from "./CollectionSettingsTab";

export interface DomainSettingsProps extends RouteComponentProps<{tab?: string}> {
  domainId: DomainId;
}

export class DomainSettings extends React.Component<DomainSettingsProps, {}> {
  private readonly _breadcrumbs =[{title: "Settings"}];

  public render(): ReactNode {
    const tab = this.props.match.params.tab || "general";
    const baseUrl = toDomainRoute(this.props.domainId, `settings`);
    return (
      <Page breadcrumbs={this._breadcrumbs}>
        <Card title={ <span><SettingOutlined /> Settings</span>} className={styles.domainSettings}>
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
            <Tabs.TabPane tab="Models" key="models">
              <DomainModelSettingsTab domainId={this.props.domainId} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Collections" key="collections">
              <DomainCollectionSettingsTab domainId={this.props.domainId} />
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
