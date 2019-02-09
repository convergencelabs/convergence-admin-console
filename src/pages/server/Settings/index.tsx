import * as React from 'react';
import {Page} from "../../../components/Page/";
import {ReactNode} from "react";
import {BasicBreadcrumbsProducer} from "../../../stores/BreacrumStore";
import {Card, Form, Icon, Tabs} from "antd";
import {FormComponentProps} from "antd/lib/form";
import {NamespaceSettings} from "./NamespaceSettings";
import {DomainSettings} from "./DomainSettings";
import {ApiKeysSettings} from "./ApiKeysSettings";

const {TabPane} = Tabs;

export class SettingsComponent extends React.Component<FormComponentProps, {}> {
  private readonly breadcrumbs = new BasicBreadcrumbsProducer([{title: "Settings"}]);

  render(): ReactNode {
    return (
      <Page breadcrumbs={this.breadcrumbs.breadcrumbs()}>
        <Card title={<span><Icon type="setting"/> Settings</span>}>
          <Tabs>
            <TabPane tab="Namespaces" key="namespaces"><NamespaceSettings/></TabPane>
            <TabPane tab="Domains" key="domains"><DomainSettings/></TabPane>
            <TabPane tab="API Keys" key="api-keys"><ApiKeysSettings/></TabPane>
          </Tabs>
        </Card>
      </Page>
    );
  }
}

export const Settings = Form.create<{}>()(SettingsComponent);
