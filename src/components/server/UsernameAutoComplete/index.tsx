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
import {Component, ReactNode} from 'react';
import {AutoComplete, Select} from "antd";
import {injectAs} from "../../../utils/mobx-utils";
import {SERVICES} from "../../../services/ServiceConstants";
import {UserService} from "../../../services/UserService";
import {ConvergenceUser} from "../../../models/ConvergenceUser";

const {Option} = Select;

export interface UserAutoCompleteProps {
  className: string;
  onChange: (username: string) => void;
  placeholder?: string;
  value?: string;
}

export interface InjectedProps extends UserAutoCompleteProps{
  userService: UserService;
}

export interface UsernameAutoCompleteState {
  users: ConvergenceUser[];
  selectedValue: string;
}

export class UsernameAutoCompleteComponent extends Component<InjectedProps, UsernameAutoCompleteState> {
  state = {
    users: [],
    selectedValue: ""
  };

  public render(): ReactNode {
    const {users} = this.state;
    const {className, placeholder, value} = this.props;
    const inputValue = value !== undefined ? value: this.state.selectedValue;

    const children = users.map((user: ConvergenceUser) =>
      <Option
        key={user.username}
        value={user.username}
        title={user.username}>{user.displayName} ({user.username})
      </Option>);
    return (
      <AutoComplete
        className={className}
        onSearch={this._onSearch}
        onChange={this._onChange}
        value={inputValue}
        optionLabelProp="value"
        placeholder={placeholder || "Select User"}
      >
        {children}
      </AutoComplete>
    );
  }

  private _onChange = (value: any) => {
    this.setState({selectedValue: value});
    this.props.onChange(value);
  }

  private _onSearch = (value: string) => {
    this.props.userService.getUsers(value, 0, 10).then(users => {
      this.setState({users});

    });
  }
}

export const UsernameAutoComplete = injectAs<UserAutoCompleteProps>([SERVICES.USER_SERVICE], UsernameAutoCompleteComponent);
