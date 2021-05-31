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

import * as React from 'react';
import {Component, MouseEvent, ReactNode} from 'react';
import styles from "./styles.module.css";
import {UsernameAutoComplete} from "../UsernameAutoComplete";
import {Button, Select} from "antd";

const {Option} = Select;

export interface UserRoleAdderProps {
  roles: string[];
  defaultRole: string;
  selectWidth: number;
  onAdd(username: string, role: string): void;
}

export interface UserRoleAdderState {
  selectedUsername: string | null;
  selectedRole: string;
}

export class UserRoleAdder extends Component<UserRoleAdderProps,UserRoleAdderState> {

  constructor(props: UserRoleAdderProps) {
    super(props);

    this.state = {
      selectedUsername: null,
      selectedRole: this.props.defaultRole || ""
    };
  }


  public render(): ReactNode {
    return (
      <div className={styles.userRoleAdder}>
        <UsernameAutoComplete
          onChange={this._onChangeUsername}
          className={styles.username}
          value={this.state.selectedUsername}
          placeholder="Select User to Add"/>
        <Select
          style={{ width: this.props.selectWidth }}
          value={this.state.selectedRole}
          onSelect={this._onSelectRole}
        >
          {this.props.roles.map(role => <Option key={role} value={role}>{role}</Option>)}
        </Select>
        <Button
          htmlType="button"
          type="primary"
          disabled={this.state.selectedUsername === ""}
          onClick={this._onAdd}>Add</Button>
      </div>
    )
  }

  private _onSelectRole = (role: string) => {
    this.setState({selectedRole: role});
  }

  private _onChangeUsername = (username: string) => {
    this.setState({selectedUsername: username});
  }

  private _onAdd = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({selectedUsername: null, selectedRole: this.props.defaultRole});

    this.props.onAdd(this.state.selectedUsername!, this.state.selectedRole);
  }
}
