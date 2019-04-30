import React, {ReactNode} from "react";
import {Card, Tabs} from "antd";
import {Icon} from 'antd';
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

  constructor(props: DomainAuthenticationProps) {
    super(props);
  }

  public render(): ReactNode {
    const tab = this.props.match.params.tab || "jwt";
    const baseUrl = toDomainRoute(this.props.domainId, `authentication`);
    return (
      <Page breadcrumbs={this._breadcrumbs}>
        <Card title={ <span><Icon type="lock"/> Authentication</span>} className={styles.formCard}>
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
