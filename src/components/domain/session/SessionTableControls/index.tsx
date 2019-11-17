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
import {Button, Col, Form, Input, Row, Select} from "antd";
import {FormComponentProps} from "antd/lib/form";
import styles from "./styles.module.css";
import {FormCreateOption} from "antd/es/form";

export interface SessionTableFilters {
  sessionId: string;
  username: string;
  remoteHost: string;
  authMethod: string;
}

export interface SessionTableControlsProps extends FormComponentProps{
  onFilter(filters: SessionTableFilters): void;
}

class SessionTableControlsForm extends React.Component<SessionTableControlsProps, {}> {

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

const formOptions: FormCreateOption<SessionTableControlsProps> = {};
export const SessionTableControls = Form.create(formOptions)(SessionTableControlsForm);
