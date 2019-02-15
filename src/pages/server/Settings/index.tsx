import * as React from 'react';
import {Page} from "../../../components/Page/";
import {ReactNode} from "react";
import {BasicBreadcrumbsProducer} from "../../../stores/BreacrumStore";
import {Card, Form, Icon, Tabs} from "antd";
import {FormComponentProps} from "antd/lib/form";
import {NamespaceAndDomainSettings} from "./NamespaceAndDomainSettings";
import {ApiKeysSettings} from "./ApiKeysSettings";
import {PasswordPolicy} from "./PasswordPolicy";

const {TabPane} = Tabs;

export class SettingsComponent extends React.Component<FormComponentProps, {}> {
  private readonly breadcrumbs = new BasicBreadcrumbsProducer([{title: "Settings"}]);

  render(): ReactNode {
    return (
      <Page breadcrumbs={this.breadcrumbs.breadcrumbs()}>
        <Card title={<span><Icon type="setting"/> Settings</span>}>
          <Tabs>
            <TabPane tab="Namespaces and Domains" key="namespaces and domains"><NamespaceAndDomainSettings/></TabPane>
            <TabPane tab="API Keys" key="api-keys"><ApiKeysSettings/></TabPane>
            <TabPane tab="Password Policy" key="passwords"><PasswordPolicy/></TabPane>
          </Tabs>
        </Card>
      </Page>
    );
  }
}

export const Settings = Form.create<{}>()(SettingsComponent);
