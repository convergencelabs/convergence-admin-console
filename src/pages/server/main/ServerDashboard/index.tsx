import React, {ReactNode} from "react";
import {Page} from "../../../../components/common/Page/";
import {Col, Row} from "antd";
import styles from "./styles.module.css";
import {SpacedGrid} from "../../../../components/common/SpacedGrid/";
import {RecentDomains} from "../../../../components/server/FavoriteDomains/";
import {ServerAlerts} from "../../../../components/server/ServerAlerts/";
import {ServerInfo} from "../../../../components/server/ServerInfo";

export class ServerDashboard extends React.Component<{}, {}> {

  public render(): ReactNode {
    return (
      <Page breadcrumbs={[]}>
        <SpacedGrid>
          <Row gutter={16} type="flex">
            <Col xs={24} sm={24} md={12} lg={12} xl={12} className={styles.col}>
              <ServerInfo/>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <ServerAlerts/>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <RecentDomains/>
            </Col>
          </Row>
        </SpacedGrid>
      </Page>
    );
  }
}
