import * as React from 'react';
import {Page} from "../../../components/Page/";
import {ReactNode} from "react";
import {BasicBreadcrumbsProducer} from "../../../stores/BreacrumStore";
import {Card, Col, Row} from "antd";
import {Form, Input, Tooltip, Icon, Button, Select} from 'antd';
import {FormComponentProps} from "antd/lib/form";
import {FormEvent} from "react";
import styles from "./styles.module.css";
import {RouteComponentProps} from "react-router";
import {FormButtonBar} from "../../../components/FormButtonBar";
import {FormFieldWithHelp} from "../../../components/FormFieldWithHelp";

const {Option} = Select;

interface CreateUserComponentState {
  confirmDirty: boolean;
}

class CreateDomainComponent extends React.Component<RouteComponentProps & FormComponentProps, CreateUserComponentState> {
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
                  {getFieldDecorator('username', {
                    rules: [{
                      required: true, whitespace: true, message: 'Please input a Username!',
                    }],
                  })(
                    <Select
                      showSearch
                      placeholder="Select a namespace"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        (option!.props!.children as any as string).toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    >
                      <Option value="jack">Jack</Option>
                      <Option value="lucy">Lucy</Option>
                      <Option value="tom">Tom</Option>
                    </Select>,
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
                  {getFieldDecorator('displayName', {
                    rules: [{required: true, message: 'Please input a Display Name!', whitespace: true}],
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
                  {getFieldDecorator('firstName', {
                    rules: [{
                      required: false, whitespace: true, message: 'Please input a First Name!',
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
        console.log('Received values of form: ', values);
      }
    });
  }

  private handleConfirmBlur = (e: any) => {
    const value = e.target.value;
    this.setState({confirmDirty: this.state.confirmDirty || !!value});
  }

  private compareToFirstPassword = (rule: any, value: any, callback: (error?: string) => void) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  }

  private validateToNextPassword = (rule: any, value: any, callback: (error?: string) => void) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], {force: true});
    }
    callback();
  }
}

export const CreateDomain = Form.create<{}>()(CreateDomainComponent);
