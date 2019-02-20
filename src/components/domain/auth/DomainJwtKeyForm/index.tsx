import React, {ReactNode} from "react";
import {Checkbox, Col, Row} from "antd";
import {Form, Input, Button} from 'antd';
import {FormComponentProps} from "antd/lib/form";
import {FormEvent} from "react";
import {DomainId} from "../../../../models/DomainId";
import {DomainJwtKey} from "../../../../models/domain/DomainJwtKey";
import {FormButtonBar} from "../../../common/FormButtonBar";

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


class DomainJwtKeyFormComponent extends React.Component<InjectedProps, {}> {
  constructor(props: InjectedProps) {
    super(props);
  }

  public render(): ReactNode {
    const {getFieldDecorator} = this.props.form;
    return (
      <Form onSubmit={this._handleSubmit}>
        <Form.Item label="Id">
          {getFieldDecorator('id', {
            initialValue: this.props.initialValue.id,
            rules: [{
              required: true, whitespace: true, message: 'Please input a Id!',
            }],
          })(
            <Input disabled={this.props.disableId}/>
          )}
        </Form.Item>
        <Form.Item label="Description">
          {getFieldDecorator('description', {
            initialValue: this.props.initialValue.description,
            rules: [{required: true, message: 'Please input a Description!', whitespace: true}],
          })(
            <Input.TextArea autosize={{minRows: 2, maxRows: 6}}/>
          )}
        </Form.Item>
        <Form.Item label="Public Key">
          {getFieldDecorator('key', {
            initialValue: this.props.initialValue.description,
            rules: [{required: true, message: 'Please input a Public Key!', whitespace: true}],
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
