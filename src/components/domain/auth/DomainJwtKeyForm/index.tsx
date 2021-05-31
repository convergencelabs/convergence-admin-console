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

import React, {ReactNode} from "react";
import {Button, Checkbox, Col, Form, FormInstance, Input, Row} from "antd";
import {DomainId} from "../../../../models/DomainId";
import {DomainJwtKey} from "../../../../models/domain/DomainJwtKey";
import {FormButtonBar} from "../../../common/FormButtonBar";
import {GenerateJwtKey} from "../GenerateJwtKey";

export interface DomainJwtKeyFormProps {
  domainId: DomainId;
  initialValue: DomainJwtKey;
  saveButtonLabel: string;
  disableId: boolean;

  onCancel(): void;

  onSave(group: DomainJwtKey): void;
}

interface DomainJwtKeyFormState {
  generateKey: boolean;
}


export class DomainJwtKeyForm extends React.Component<DomainJwtKeyFormProps, DomainJwtKeyFormState> {
  private _formRef = React.createRef<FormInstance>();

  constructor(props: DomainJwtKeyFormProps) {
    super(props);

    this.state = {
      generateKey: false
    }
  }

  public render(): ReactNode {
    return (
        <Form layout="vertical"
              onFinish={this._handleSubmit}>
          <Form.Item name="id"
                     label="Id"
                     initialValue={this.props.initialValue.id}
                     rules={[{
                       required: !this.props.disableId, whitespace: true, message: 'Please input a Id!',
                     }]}
          >
            <Input disabled={this.props.disableId}/>
          </Form.Item>
          <Form.Item name="description"
                     label="Description"
                     initialValue={this.props.initialValue.description}
                     rules={[{required: false, message: 'Please input a Description!', whitespace: true}]}
          >
            <Input.TextArea autoSize={{minRows: 2, maxRows: 6}}/>
          </Form.Item>
          <Form.Item name="enabled"
                     initialValue={this.props.initialValue.enabled}
                     valuePropName='checked'
                     required={true}
          >
            <Checkbox>Enabled</Checkbox>
          </Form.Item>
          <Form.Item name="key"
                     label="Public Key"
                     initialValue={this.props.initialValue.key}
                     rules={[{required: true, message: 'Please input a Public Key!', whitespace: true}]}
          >
            <Input.TextArea autoSize={{minRows: 6, maxRows: 10}}/>
          </Form.Item>

          <Button htmlType="button" onClick={this._generateKey}>Generate Key</Button>
          {this.state.generateKey ?
              (<GenerateJwtKey onCancel={this._onModalCancel} onUse={this._onUseKey}/>)
              : null
          }

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

  private _generateKey = () => {
    this.setState({generateKey: true});
  }

  private _onModalCancel = () => {
    this.setState({generateKey: false});
  }

  private _onUseKey = (publicKey: string) => {
    this.setState({generateKey: false});
    this._formRef.current!.setFieldsValue({key: publicKey});
  }

  private _handleCancel = () => {
    this.props.onCancel();
  }

  private _handleSubmit = (values: any) => {
    const {id, description, key, enabled} = values;
    const jwtKey = new DomainJwtKey(id, description, new Date(), key, enabled);
    this.props.onSave(jwtKey);
  }
}
