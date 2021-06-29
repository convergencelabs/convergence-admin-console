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
import { DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Button, List, Popconfirm } from "antd";
import {DomainUsernameAutoComplete} from "../DomainUsernameAutoComplete";
import {DomainId} from "../../../../models/DomainId";
import styles from "./styles.module.css";

interface DomainUserListProps {
  domainId: DomainId;
  users: string[];

  onChange(users: string[]): void;
}

interface DomainUserListState {
  username: string | null;
}

export class DomainUserList extends React.Component<DomainUserListProps, DomainUserListState> {
  state = {
    username: null
  };

  public render(): ReactNode {
    const disabled = this.state.username === null || this.state.username === "";
    return (
      <div>
        <div className={styles.addControl}>
          <DomainUsernameAutoComplete
            domainId={this.props.domainId}
            className={styles.username}
            value={this.state.username}
            onChange={this._onUsernameChanged}
            placeholder="Select User"
          />
          <Button
            htmlType="button"
            type="primary"
            onClick={this._onAdd}
            disabled={disabled}
          >Add</Button>
        </div>
        <List
          className={styles.userList}
          size="small"
          split={true}
          rowKey="username"
          bordered
          dataSource={this.props.users}
          renderItem={this._renderUser}
        />
      </div>
    );
  }

  private _renderUser = (user: string) => {
    return (
      <List.Item className={styles.user}>
        <div className={styles.username}>{user}</div>
        <Popconfirm title="Remove user from group?"
                    placement="topRight"
                    onConfirm={() => this._onDelete(user)}
                    okText="Yes"
                    cancelText="No"
                    icon={<QuestionCircleOutlined style={{color: 'red'}} />}
        >
          <Button htmlType="button" icon={<DeleteOutlined />} size="small" shape="circle"/>
        </Popconfirm>
      </List.Item>
    );
  }

  private _onDelete = (username: string) => {
    const users = this.props.users.filter(u => u !== username);
    this.props.onChange(users);
  }

  private _onUsernameChanged = (username: string) => {
    this.setState({username});
  }

  private _onAdd = () => {
    const users = this.props.users.slice(0);
    users.push(this.state.username!);
    this.props.onChange(users);
    this.setState({username: ""});
  }
}
