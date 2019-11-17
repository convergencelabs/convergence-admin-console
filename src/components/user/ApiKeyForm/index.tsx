/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is part of the Convergence Server, which is released under
 * the terms of the GNU General Public License version 3 (GPLv3). A copy
 * of the GPLv3 should have been provided along with this file, typically
 * located in the "LICENSE" file, which is part of this source code package.
 * Alternatively, see <https://www.gnu.org/licenses/gpl-3.0.html> for the
 * full text of the GPLv3 license, if it was not provided.
 */

import React, {FormEvent, ReactNode} from "react";
import {Button, Checkbox, Col, Form, Input, Row,} from "antd";
import {FormComponentProps} from "antd/lib/form";
import {UserApiKey} from "../../../models/UserApiKey";
import {FormButtonBar} from "../../common/FormButtonBar";
import {FormCreateOption} from "antd/es/form";

interface DomainCollectionFormProps extends FormComponentProps {
  initialValue: UserApiKey;
  saveButtonLabel: string;

  onCancel(): void;

  onSave(data: {name: string, enabled: boolean}): void;
}

class ApiKeyFormComponent extends React.Component<DomainCollectionFormProps, {}> {
  public render(): ReactNode {
    const {getFieldDecorator} = this.props.form;
    const {initialValue} = this.props;
    return (
      <Form onSubmit={this._handleSubmit}>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label="Name">
              {getFieldDecorator('name', {
                initialValue: initialValue.name,
                rules: [{
                  required: true, whitespace: true, message: 'Please input an API Key name!',
                }],
              })(
                <Input/>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            {getFieldDecorator('enabled', {
              initialValue: initialValue.enabled,
              valuePropName: 'checked'
            })(
              <Checkbox>Enabled</Checkbox>)}
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <FormButtonBar>
              <Button htmlType="button" onClick={this._handleCancel}>Cancel</Button>
              <Button type="primary" htmlType="submit">{this.props.saveButtonLabel}</Button>
            </FormButtonBar>
          </Col>
        </Row>
      </Form>
    );
  }

  private _handleCancel = () => {
    this.props.onCancel();
  }

  private _handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values: any) => {
      if (!err) {
        const {name, enabled} = values;
        this.props.onSave({name, enabled});
      }
    });
  }
}

const formOptions: FormCreateOption<DomainCollectionFormProps> = {};
export const ApiKeyForm = Form.create(formOptions)(ApiKeyFormComponent);
