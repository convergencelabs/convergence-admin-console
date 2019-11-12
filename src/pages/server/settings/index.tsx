/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import React, {ReactNode} from "react";
import {Page} from "../../../components/common/Page/";
import {Card, Form, Icon, Tabs} from "antd";
import {FormComponentProps} from "antd/lib/form";
import {NamespaceSettings} from "./NamespaceSettings";
import {PasswordPolicy} from "./PasswordPolicy";
import {SessionTimeout} from "./SessionTimeout";
import styles from "./styles.module.css";

export class SettingsComponent extends React.Component<FormComponentProps, {}> {
  private readonly _breadcrumbs = [{title: "Settings"}];

  render(): ReactNode {
    return (
      <Page breadcrumbs={this._breadcrumbs}>
        <Card title={<span><Icon type="setting"/> Settings</span>}>
          <Tabs>
            <Tabs.TabPane tab="Namespaces" key="namespaces and domains">
              <Card title="Namespaces" type="inner" className={styles.groupCard}>
                <NamespaceSettings/>
              </Card>
            </Tabs.TabPane>
            {/*<TabPane tab="API Keys" key="api-keys"><ApiKeysSettings/></TabPane>*/}
            <Tabs.TabPane tab="Security" key="security">
              <Card title="Sessions" type="inner" className={styles.groupCard}>
                <SessionTimeout />
              </Card>
              <Card title="Password Policy" type="inner" className={styles.groupCard}>
                <PasswordPolicy/>
              </Card>
            </Tabs.TabPane>
          </Tabs>
        </Card>
      </Page>
    );
  }
}

export const Settings = Form.create()(SettingsComponent);
