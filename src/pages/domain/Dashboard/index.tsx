import {Component, ReactNode} from "react";
import * as React from "react";
import {IBreadcrumbSegment} from "../../../stores/BreacrumStore";
import {DomainBreadcrumbProducer} from "../DomainBreadcrumProducer";
import {match, RouteComponentProps} from "react-router";
import {Page} from "../../../components/Page";
import {Row, Col, Card, Tabs, Input, Button} from 'antd';
import CopyToClipboard from "react-copy-to-clipboard";

const TabPane = Tabs.TabPane;
import styles from "./styles.module.css";
import Highlight from "react-highlight";
import {ConnectionPasswordSnippet} from "./snippet_connection_password";
import {domainStore} from "../../../stores/DomainStore";
import {connectionAnonymousSnippet} from "./snippet_connection_anonymous";
import {connectionJwtSnippet} from "./snippet_connection_jwt";
import {modelOpenSnippet} from "./snippet_model_open";
import {modelOpenAutoCreateSnippet} from "./snippet_model_open_auto_create";
import {ModelCreateSnippet} from "./snippet_model_create";
import {modelDataSnippet} from "./snippet_model_data";
import {InfoTable, InfoTableRow} from "../../../components/InfoTable";

export class DomainDashboard extends Component<RouteComponentProps, {}> {

  private breadcrumbsProvider = new DomainDashboardBreadcrumbs();

  public render(): ReactNode {
    const domain = domainStore.domains[0];

    const domainUrl = "http://someurl/somenamespace/somedomain/realtime";

    const copier =
      <CopyToClipboard text={domainUrl}
                       onCopy={() => {
                       }}>
        <Button className={styles.copyButton} htmlType="button" icon="copy"/>
      </CopyToClipboard>;

    return (
      <Page breadcrumbs={this.breadcrumbsProvider.breadcrumbs(this.props.match)}>
        <Row gutter={16}>
          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            <Card className={styles.card} title="Overview">
              <InfoTable>
                <InfoTableRow label="Namespace">My Namespace</InfoTableRow>
                <InfoTableRow label="Id">My Domain</InfoTableRow>
                <InfoTableRow label="Owner">Some User</InfoTableRow>
                <InfoTableRow label="Status">Online</InfoTableRow>
              </InfoTable>
            </Card>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            <Card className={styles.card} title="Statistics">
              <InfoTable>
                <InfoTableRow label="Active Sessions">7</InfoTableRow>
                <InfoTableRow label="Total Users">53</InfoTableRow>
                <InfoTableRow label="Total Models">201</InfoTableRow>
                <InfoTableRow label="Storage">475MB</InfoTableRow>
              </InfoTable>
            </Card>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <Card title="Connection URL" className={styles.card}>
              <Input placeholder="Basic usage"
                     value={domainUrl}
                     readOnly={true}
                     addonAfter={copier}
              />
            </Card>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <Card className={styles.card} title="Code Snippets">
              <Tabs
                defaultActiveKey="1"
                tabPosition="left"
                type="card"
              >
                <TabPane tab="Connection" key="connection">
                  <Tabs defaultActiveKey="password">
                    <TabPane tab="Password" key="password">
                      <ConnectionPasswordSnippet connectionUrl={domainUrl}/>
                    </TabPane>
                    <TabPane tab="Anonymous" key="anonymous">
                      <Highlight className={"JavaScript"}>{connectionAnonymousSnippet(domainUrl)}</Highlight>
                    </TabPane>
                    <TabPane tab="JWT" key="jwt">
                      <Highlight className={"JavaScript"}>{connectionJwtSnippet(domainUrl)}</Highlight>
                    </TabPane>
                    <TabPane tab="Reconnect" key="reconnect">
                      <Highlight className={"JavaScript"}>{connectionAnonymousSnippet(domainUrl)}</Highlight>
                    </TabPane>
                  </Tabs>
                </TabPane>
                <TabPane tab="Model" key="model">
                  <Tabs defaultActiveKey="open">
                    <TabPane tab="Open" key="open">
                      <Highlight className={"JavaScript"}>{modelOpenSnippet}</Highlight>
                    </TabPane>
                    <TabPane tab="Create" key="create"><ModelCreateSnippet/></TabPane>
                    <TabPane tab="Open Auto Create" key="jwt">
                      <Highlight className={"JavaScript"}>{modelOpenAutoCreateSnippet}</Highlight>
                    </TabPane>
                    <TabPane tab="Data" key="reconnect">
                      <Highlight className={"JavaScript"}>{modelDataSnippet}</Highlight>
                    </TabPane>
                  </Tabs>
                </TabPane>
                <TabPane tab="Activity" key="activity"></TabPane>
                <TabPane tab="Chat" key="chat"></TabPane>
                <TabPane tab="Presence" key="presence"></TabPane>
              </Tabs>
            </Card>
          </Col>
        </Row>
      </Page>
    );
  }
}

export class DomainDashboardBreadcrumbs extends DomainBreadcrumbProducer {
  public breadcrumbs(match: match): IBreadcrumbSegment[] {
    const segments = super.breadcrumbs(match);
    segments.push({title: "Dashboard"});
    return segments;
  }
}
