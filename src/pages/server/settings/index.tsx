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
import {Page} from "../../../components";
import { SettingOutlined } from '@ant-design/icons';
import {Card, Tabs} from "antd";
import {NamespaceSettings} from "./NamespaceSettings";
import {PasswordPolicy} from "./PasswordPolicy";
import {SessionTimeout} from "./SessionTimeout";
import styles from "./styles.module.css";

export class Settings extends React.Component<{}, {}> {
  private readonly _breadcrumbs = [{title: "Settings"}];

  render(): ReactNode {
    return (
      <Page breadcrumbs={this._breadcrumbs}>
        <Card title={<span><SettingOutlined /> Settings</span>}>
          <Tabs>
            <Tabs.TabPane tab="Namespaces" key="namespaces and domains">
              <Card title="Namespaces" type="inner" className={styles.groupCard}>
                <NamespaceSettings/>
              </Card>
            </Tabs.TabPane>
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
