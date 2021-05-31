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
import {Button, Col, Form, FormInstance, Input, Row, Select} from "antd";
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

export class SessionTableControls extends React.Component<SessionTableControlsProps, {}> {
  private _formRef = React.createRef<FormInstance>();

  public render(): ReactNode {
    return (
        <Form ref={this._formRef}>
          <div className={styles.toolbar}>
            <Row gutter={16}>
              <Col span={6}>
                <Form.Item
                    name="sessionId"
                    label="Session Id"
                    className={styles.label}
                >
                  <Input className={styles.sessionId}/>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                    name="username"
                    label="Username"
                    className={styles.label}
                >
                  <Input className={styles.username}/>
                </Form.Item>
              </Col>
              <Col span={3}>
                <Form.Item
                    name="authMethod"
                    label="Auth Method"
                    className={styles.label}
                >
                  <Select className={styles.authMethod}>
                    <Select.Option value="jwt">JWT</Select.Option>
                    <Select.Option value="password">Password</Select.Option>
                    <Select.Option value="reconnect">Reconnect</Select.Option>
                    <Select.Option value="anonymous">Anonymous</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={7}>
                <Form.Item
                    name="remoteHost"
                    label="Remote Host"
                    className={styles.label}
                >
                  <Input className={styles.remoteHost}/>
                </Form.Item>
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
        </Form>
    );
  }

  private _handleSubmit = () => {
    this._formRef.current!.validateFields().then(values => {
      const {sessionId, username, remoteHost, authMethod} = values;
      this.props.onFilter({sessionId, username, remoteHost, authMethod});
    });
  }
}
