import * as React from 'react';
import {ReactNode} from "react";
import {Button, Form, Input, Select} from "antd";
import {FormFieldWithHelp} from "../../../components/FormFieldWithHelp";
import {FormButtonBar} from "../../../components/FormButtonBar";
import {FormComponentProps} from "antd/lib/form";
import {FormEvent} from "react";

const {Option} = Select;

class DomainSettingsComponent extends React.Component<FormComponentProps, {}> {
  render(): ReactNode {
    const {getFieldDecorator} = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} layout="horizontal">
        <Form.Item label={(
          <FormFieldWithHelp
            label="Domain Mode"
            tooltip="Determines if the server will allow multiple domains or only a single domain."
          />
        )}>
          {getFieldDecorator('domainMode', {
            rules: []
          })(
            <Select>
              <Option key="single" value="single">Single Domain</Option>
              <Option key="multi" value="multi">Multi Domain</Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item label={(
          <FormFieldWithHelp
            label="Default Domain Id"
            tooltip={
              `The id of the domain to use when in Single Domain mode.
               This domain will automatically be created and can not be deleted.`
            }
          />
        )}>
          {getFieldDecorator('username', {
            rules: [{
              required: true, whitespace: true, message: 'Enter a default domain id',
            }],
          })(
            <Input/>
          )}
        </Form.Item>
        <FormButtonBar>
          <Button type="primary" htmlType="submit">Save</Button>
        </FormButtonBar>
      </Form>
    );
  }

  private handleSubmit = (e: FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }
}

export const DomainSettings = Form.create<{}>()(DomainSettingsComponent);
