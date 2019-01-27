import * as React from 'react';
import styles from './styles.module.css';
import {Layout} from "antd";
import {ReactNode} from "react";

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
