import * as React from 'react';
import {Page} from "../../../../components/Page/index";
import {ReactNode} from "react";
import {Card, Col, Icon, Row} from "antd";
import {InfoTable, InfoTableRow} from "../../../../components/InfoTable/index";
import styles from "./styles.module.css";
import {SpacedGrid} from "../../../../components/SpacedGrid/index";
import {RecentDomains} from "../../../../components/FavoriteDomains/index";
import {ServerAlerts} from "../../../../components/ServerAlerts/index";
import {BasicBreadcrumbsProducer} from "../../../../stores/BreacrumStore";

export class ServerDashboard extends React.Component<{}, {}> {
  private readonly _breadcrumbs = new BasicBreadcrumbsProducer();
  render(): ReactNode {
    return (
      <Page breadcrumbs={this._breadcrumbs}>
        <SpacedGrid>
          <Row gutter={16}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Card className={styles.card} title={<span><Icon type="profile"/> Server Status</span>}>
                <InfoTable>
                  <InfoTableRow label="Version">1.0.0-rc.1</InfoTableRow>
                  <InfoTableRow label="Uptime">3 Hours</InfoTableRow>
                  <InfoTableRow label="Total Connections">23</InfoTableRow>
                  <InfoTableRow label="Status">Healthy <Icon type="check-circle" style={{color: "green"}}/></InfoTableRow>
                </InfoTable>
              </Card>
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
