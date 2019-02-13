import * as React from 'react';
import {Page} from "../../../../components/Page/index";
import {ReactNode} from "react";
import {BasicBreadcrumbsProducer} from "../../../../stores/BreacrumStore";
import {Card, Col, notification, Row} from "antd";
import {Form, Input, Tooltip, Icon, Button} from 'antd';
import {FormComponentProps} from "antd/lib/form";
import {FormEvent} from "react";
import styles from "./styles.module.css";
import {RouteComponentProps} from "react-router";
import {FormButtonBar} from "../../../../components/FormButtonBar/";
import {FormFieldWithHelp} from "../../../../components/FormFieldWithHelp/";
import {NamespaceAutoComplete} from "../../../../components/NamespaceAutoComplete";
import {injectAs} from "../../../../utils/mobx-utils";
import {SERVICES} from "../../../../services/ServiceConstants";
import {DomainService} from "../../../../services/DomainService";

interface CreateUserComponentState {
  confirmDirty: boolean;
}

interface InjectedProps extends RouteComponentProps, FormComponentProps {
  domainService: DomainService;
}

class CreateDomainComponent extends React.Component<InjectedProps, CreateUserComponentState> {
  private readonly breadcrumbs = new BasicBreadcrumbsProducer([
    {title: "Domains", link: "/domains"},
    {title: "New Domain"}
  ]);

  state = {
    confirmDirty: false
  };

  public render(): ReactNode {
    const {getFieldDecorator} = this.props.form;
    return (
      <Page breadcrumbs={this.breadcrumbs.breadcrumbs()}>
        <Card title={<span><Icon type="database"/> New Domain</span>} className={styles.formCard}>
          <Form onSubmit={this.handleSubmit}>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label="Namespace">
                  {getFieldDecorator('namespace', {
                    rules: [{
                      required: true, whitespace: true, message: 'Please input a namespace id!',
                    }],
                  })(
                    <NamespaceAutoComplete
                      className="foo"
                      onChange={() => {}}/>
                  )}
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label={(
                  <FormFieldWithHelp
                    label="Domain Id"
                    tooltip="The url friendly id that will be used to connect to the domain."
                  />
                )}>
                  {getFieldDecorator('id', {
                    rules: [{required: true, message: 'Please input a domain id!', whitespace: true}],
                  })(
                    <Input placeholder="Enter a unique id"/>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label={(
                  <FormFieldWithHelp
                    label="Display Name"
                    tooltip="A nickname that will be displayed in the admin console."
                  />
                )}>
                  {getFieldDecorator('displayName', {
                    rules: [{
                      required: false, whitespace: true, message: 'Please input a display name!',
                    }],
                  })(
                    <Input placeholder="Enter an optional display name"/>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <FormButtonBar>
                  <Button htmlType="button" onClick={this._handleCancel}>Cancel</Button>
                  <Button type="primary" htmlType="submit">Create</Button>
                </FormButtonBar>
              </Col>
            </Row>
          </Form>
        </Card>
      </Page>
    );
  }

  private _handleCancel = () => {
    this.props.history.push("/domains/");
  }

  private handleSubmit = (e: FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const {namespace, id, displayName} = values;
        this.props.domainService
          .createDomain(namespace, id, displayName)
          .then(() => {
            notification.success({
              message: "Domain Created",
              description: `The domain '${namespace}/${id}' was successfully created.`
            });
            this.props.history.push("/domains/");
          })
          .catch(err => {
            notification.error({
              message: "Namespace Not Created",
              description: "The namespace could not be created."
            })
          });
        console.log('Received values of form: ', values);
      }
    });
  }
}

export const CreateDomain = injectAs<RouteComponentProps>([SERVICES.DOMAIN_SERVICE], Form.create<{}>()(CreateDomainComponent));
