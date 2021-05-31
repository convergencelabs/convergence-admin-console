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
import { LockOutlined } from '@ant-design/icons';
import { Card, Tabs } from "antd";
import styles from "./styles.module.css";
import {RouteComponentProps} from "react-router";
import {DomainId} from "../../../models/DomainId";
import {Page} from "../../../components/common/Page";
import {DomainJwtKeys} from "./jwt/DomainJwtKeys";
import {toDomainRoute} from "../../../utils/domain-url";
import {AnonymousAuthForm} from "./anonymous/AnonymousAuthForm";

export interface DomainAuthenticationProps extends RouteComponentProps<{tab: string}> {
  domainId: DomainId;
}

export class DomainAuthentication extends React.Component<DomainAuthenticationProps, {}> {
  private readonly _breadcrumbs = [{title: "Authentication"}];

  public render(): ReactNode {
    const tab = this.props.match.params.tab || "jwt";
    const baseUrl = toDomainRoute(this.props.domainId, `authentication`);
    return (
      <Page breadcrumbs={this._breadcrumbs}>
        <Card title={ <span><LockOutlined /> Authentication</span>} className={styles.formCard}>
          <Tabs className={styles.tabs}
                type="card"
                defaultActiveKey={tab}
                onChange={key => {
                  this.props.history.push(`${baseUrl}/${key}`);
                }}
          >
            <Tabs.TabPane tab="JWT Authentication" key="jwt">
              <DomainJwtKeys
                domainId={this.props.domainId}
                history={this.props.history}
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Anonymous Authentication" key="anonymous">
              <AnonymousAuthForm domainId={this.props.domainId}/>
            </Tabs.TabPane>
          </Tabs>
        </Card>
      </Page>
    );
  }
}
