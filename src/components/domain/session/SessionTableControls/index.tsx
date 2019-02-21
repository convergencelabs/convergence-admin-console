import React, {ReactNode} from "react";
import {Input, Select, Form, Button, Row, Col} from "antd";
import {FormComponentProps} from "antd/lib/form";
import styles from "./styles.module.css";

export interface SessionTableFilters {
  sessionId: string;
  username: string;
  remoteHost: string;
  authMethod: string;
}

export interface SessionTableControlsProps {
  onFilter(filters: SessionTableFilters): void;
}

interface InjectedProps extends SessionTableControlsProps, FormComponentProps {

}

class SessionTableControlsForm extends React.Component<InjectedProps, {}> {

  public render(): ReactNode {
    const {getFieldDecorator} = this.props.form;

    return (
      <div className={styles.toolbar}>
        <Row  gutter={16}>
          <Col span={6}>
            <div className={styles.label}>Session Id:</div>
            {getFieldDecorator('sessionId',)(
              <Input className={styles.sessionId}/>
            )}
          </Col>
          <Col span={6}>
            <div className={styles.label}>Username:</div>
            {getFieldDecorator('username')(
              <Input className={styles.username}/>
            )}
          </Col>
          <Col span={3}>
            <div className={styles.label}>Auth Method:</div>
            {getFieldDecorator('authMethod')(
              <Select className={styles.authMethod}>
                <Select.Option value="jwt">JWT</Select.Option>
                <Select.Option value="password">Password</Select.Option>
                <Select.Option value="reconnect">Reconnect</Select.Option>
                <Select.Option value="anonymous">Anonymous</Select.Option>
              </Select>
            )}
          </Col>
          <Col span={7}>
            <div className={styles.label}>Remote Host:</div>
            {getFieldDecorator('remoteHost')(
              <Input className={styles.remoteHost}/>
            )}
          </Col>
          <Col span={2}>
            <div className={styles.filter}>
              <div className={styles.label}>&nbsp;</div>
              <Button htmlType="button"
                      type="primary"
                      className={styles.button}
                      onClick={this._handleSubmit}>Filter</Button>
            </div>
          </Col>
        </Row>
      </div>
    );
  }

  private _handleSubmit = () => {
    this.props.form.validateFieldsAndScroll((err: any, values: any) => {
      if (!err) {
        const {sessionId, username, remoteHost, authMethod} = values;
        this.props.onFilter({sessionId, username, remoteHost, authMethod});
      }
    });
  }
}

export const SessionTableControls = Form.create<{}>()(SessionTableControlsForm);
