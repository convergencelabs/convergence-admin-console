import * as React from 'react';
import {ReactNode} from "react";
import {FormComponentProps} from "antd/lib/form";
import {Button, Select, Form, InputNumber} from "antd";
import {FormButtonBar} from "../../../components/FormButtonBar";
import {FormEvent} from "react";
import styles from "./styles.module.css";

const {Option} = Select;

class PasswordPolicyComponent extends React.Component<FormComponentProps, {}> {
  public render(): ReactNode {
    const {getFieldDecorator} = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} layout="horizontal">
        <Form.Item label="Minimum Length">
          {getFieldDecorator('min-length')(<InputNumber />)}
        </Form.Item>
        <Form.Item label="Require Digits">
          {getFieldDecorator('require-digit')(this._renderYesNo())}
        </Form.Item>
        <Form.Item label="Require Upper Case Character">
          {getFieldDecorator('require-upper-case')(this._renderYesNo())}
        </Form.Item>
        <Form.Item label="Require Lower Case Letters">
          {getFieldDecorator('require-lower-case')(this._renderYesNo())}
        </Form.Item>
        <Form.Item label="Require Special Characters">
          {getFieldDecorator('require-special-character')(this._renderYesNo())}
        </Form.Item>
        <FormButtonBar>
          <Button type="primary" htmlType="submit">Save</Button>
        </FormButtonBar>
      </Form>
    );
  }

  private _renderYesNo(): ReactNode {
    return (
      <Select className={styles.yesNo}>
        <Option key="yes" value="true">Yes</Option>
        <Option key="No" value="false">No</Option>
      </Select>
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

export const PasswordPolicy = Form.create<{}>()(PasswordPolicyComponent);
