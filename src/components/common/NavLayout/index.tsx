/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
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
