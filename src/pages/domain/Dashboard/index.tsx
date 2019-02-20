import React, {ReactNode} from "react";
import {DomainBreadcrumbProducer} from "../DomainBreadcrumProducer";
import {RouteComponentProps} from "react-router";
import {Page} from "../../../components/common/Page";
import {Row, Col, Card, Tabs, Input, Button, Icon} from 'antd';
import CopyToClipboard from "react-copy-to-clipboard";
import styles from "./styles.module.css";
import {ConnectionPasswordSnippet} from "./snippet_connection_password";
import {ConnectionAnonymousSnippet} from "./snippet_connection_anonymous";
import {ConnectionJwtSnippet} from "./snippet_connection_jwt";
import {ConnectionReconnectSnippet} from "./snippet_connection_reconnect";
import {ModelOpenSnippet} from "./snippet_model_open";
import {ModelOpenAutoCreate} from "./snippet_model_open_auto_create";
import {ModelCreateSnippet} from "./snippet_model_create";
import {ModelDataSnippet} from "./snippet_model_data";
import {InfoTable, InfoTableRow} from "../../../components/server/InfoTable";
import {DomainId} from "../../../models/DomainId";

const TabPane = Tabs.TabPane;

export interface DomainDashboardProps extends RouteComponentProps {
  domainId: DomainId;
}

export class DomainDashboard extends React.Component<DomainDashboardProps, {}> {

  private readonly _breadcrumbs: DomainBreadcrumbProducer;

  constructor(props: DomainDashboardProps) {
    super(props);

    this._breadcrumbs =  new DomainBreadcrumbProducer(this.props.domainId);
  }

  public render(): ReactNode {
    const {domainId} = this.props;
    const domainUrl = `http://localhost:8080/${domainId.namespace}/${domainId.id}/realtime`;



    const copier =
      <CopyToClipboard text={domainUrl}
                       onCopy={() => {
                       }}>
        <Button className={styles.copyButton} htmlType="button" icon="copy"/>
      </CopyToClipboard>;

    return (
      <Page breadcrumbs={this._breadcrumbs}>
        <div className={styles.domainDashboard}>
          <Row gutter={16}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Card className={styles.card} title={<span><Icon type="profile"/> Overview</span>}>
                <InfoTable>
                  <InfoTableRow label="Display Name">{domainId.id}</InfoTableRow>
                  <InfoTableRow label="Namespace">{domainId.namespace}</InfoTableRow>
                  <InfoTableRow label="Id">{domainId.id}</InfoTableRow>
                  <InfoTableRow label="Status">???</InfoTableRow>
                </InfoTable>
              </Card>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Card className={styles.card} title={<span><Icon type="bar-chart"/> Statistics</span>}>
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
              <Card title={<span><Icon type="cloud"/> Connection URL</span>} className={styles.card}>
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
              <Card className={styles.card} title={<span><Icon type="code"/> Code Snippets</span>}>
                <Tabs
                  defaultActiveKey="connection"
                  tabPosition="left"
                  type="card"
                >
                  <TabPane tab="Connection" key="connection">
                    <Tabs defaultActiveKey="password">
                      <TabPane tab="Password" key="password">
                        <ConnectionPasswordSnippet connectionUrl={domainUrl}/>
                      </TabPane>
                      <TabPane tab="Anonymous" key="anonymous">
                        <ConnectionAnonymousSnippet connectionUrl={domainUrl}/>
                      </TabPane>
                      <TabPane tab="JWT" key="jwt">
                        <ConnectionJwtSnippet connectionUrl={domainUrl}/>
                      </TabPane>
                      <TabPane tab="Reconnect" key="reconnect">
                        <ConnectionReconnectSnippet connectionUrl={domainUrl}/>
                      </TabPane>
                    </Tabs>
                  </TabPane>
                  <TabPane tab="Model" key="model">
                    <Tabs defaultActiveKey="open">
                      <TabPane tab="Open" key="open"><ModelOpenSnippet/></TabPane>
                      <TabPane tab="Create" key="create"><ModelCreateSnippet/></TabPane>
                      <TabPane tab="Open Auto Create" key="jwt"><ModelOpenAutoCreate/></TabPane>
                      <TabPane tab="Data" key="data"><ModelDataSnippet/></TabPane>
                    </Tabs>
                  </TabPane>
                  <TabPane tab="Activity" key="activity"/>
                  <TabPane tab="Chat" key="chat"/>
                  <TabPane tab="Presence" key="presence"/>
                </Tabs>
              </Card>
            </Col>
          </Row>
        </div>
      </Page>
    );
  }
}
