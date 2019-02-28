import React, {ReactNode} from "react";
import {Checkbox, Col, Row} from "antd";
import {Form, Input, Button} from 'antd';
import {FormComponentProps} from "antd/lib/form";
import {FormEvent} from "react";
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

interface InjectedProps extends DomainJwtKeyFormProps, FormComponentProps {

}

interface DomainJwtKeyFormState {
  generateKey: boolean;
}


class DomainJwtKeyFormComponent extends React.Component<InjectedProps, DomainJwtKeyFormState> {
  constructor(props: InjectedProps) {
    super(props);

    this.state = {
      generateKey: false
    }
  }

  public render(): ReactNode {
    const {getFieldDecorator} = this.props.form;
    return (
      <Form onSubmit={this._handleSubmit}>
        <Form.Item label="Id">
          {getFieldDecorator('id', {
            initialValue: this.props.initialValue.id,
            rules: [{
              required: !this.props.disableId, whitespace: true, message: 'Please input a Id!',
            }],
          })(
            <Input disabled={this.props.disableId}/>
          )}
        </Form.Item>
        <Form.Item label="Description">
          {getFieldDecorator('description', {
            initialValue: this.props.initialValue.description,
            rules: [{required: false, message: 'Please input a Description!', whitespace: true}],
          })(
            <Input.TextArea autosize={{minRows: 2, maxRows: 6}}/>
          )}
        </Form.Item>
        {getFieldDecorator('enabled', {
          initialValue: this.props.initialValue.enabled,
          valuePropName: 'checked',
          rules: [{required: true}],
        })(
          <Checkbox>Enabled</Checkbox>
        )}
        <Form.Item label="Public Key">
          {getFieldDecorator('key', {
            initialValue: this.props.initialValue.key,
            rules: [{required: true, message: 'Please input a Public Key!', whitespace: true}],
          })(
            <Input.TextArea autosize={{minRows: 6, maxRows: 10}}/>
          )}
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
    this.props.form.setFieldsValue({key: publicKey});
  }

  private _handleCancel = () => {
    this.props.onCancel();
  }

  private _handleSubmit = (e: FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values: any) => {
      if (!err) {
        const {id, description, key, enabled} = values;
        const jwtKey = new DomainJwtKey(id, description, new Date(), key, enabled);
        this.props.onSave(jwtKey);
      }
    });
  }
}

export const DomainJwtKeyForm = Form.create<{}>()(DomainJwtKeyFormComponent);
