import React, {ReactNode} from "react";
import {Page} from "../../../../components/common/Page/";
import {BasicBreadcrumbsProducer} from "../../../../stores/BreacrumStore";
import {Card, Form, Icon, Tabs} from "antd";
import {FormComponentProps} from "antd/lib/form";
import {NamespaceAndDomainSettings} from "./NamespaceAndDomainSettings";
import {PasswordPolicy} from "./PasswordPolicy";

export class SettingsComponent extends React.Component<FormComponentProps, {}> {
  private readonly _breadcrumbs = new BasicBreadcrumbsProducer([{title: "Settings"}]);

  render(): ReactNode {
    return (
      <Page breadcrumbs={this._breadcrumbs}>
        <Card title={<span><Icon type="setting"/> Settings</span>}>
          <Tabs>
            <Tabs.TabPane tab="Namespaces and Domains" key="namespaces and domains"><NamespaceAndDomainSettings/></Tabs.TabPane>
            {/*<TabPane tab="API Keys" key="api-keys"><ApiKeysSettings/></TabPane>*/}
            <Tabs.TabPane tab="Password Policy" key="passwords"><PasswordPolicy/></Tabs.TabPane>
          </Tabs>
        </Card>
      </Page>
    );
  }
}

export const Settings = Form.create<{}>()(SettingsComponent);
