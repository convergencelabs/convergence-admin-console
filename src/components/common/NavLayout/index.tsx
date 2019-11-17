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

import * as React from 'react';
import {ReactNode} from 'react';
import styles from './styles.module.css';
import {Layout} from "antd";

export interface NavLayoutProps {
  sideNav?: ReactNode;
}

export class NavLayout extends React.Component<NavLayoutProps, {}> {
  public render(): ReactNode {
    return (
      <Layout>
        {this.props.sideNav}
        <Layout className={styles.scroller}>
          <Layout.Content className={styles.content}>
            {this.props.children}
          </Layout.Content>
        </Layout>
      </Layout>
    );
  }
}
