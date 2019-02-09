import * as React from 'react';
import {Component, ReactNode} from "react";
import {AutoComplete} from "antd";
import {Select} from "antd";
import {injectAs} from "../../utils/mobx-utils";
import {SERVICES} from "../../services/ServiceConstants";
import {UserService} from "../../services/UserService";
import {ConvergenceUser} from "../../models/ConvergenceUser";

const {Option} = Select;

export interface InjectedProps {
  userService: UserService;
}

export interface UsernameAutoCompleteState {
  users: ConvergenceUser[];
}

export class UsernameAutoCompleteComponent extends Component<InjectedProps, UsernameAutoCompleteState> {
  state = {
    users: []
  };

  public render(): ReactNode {
    const {users} = this.state;
    const children = users.map((user: ConvergenceUser) =>
      <Option
        key={user.username}
        value={user.username}
        title={user.username}>{user.displayName} ({user.username})
      </Option>);
    return (
      <AutoComplete
        style={{width: 400}}
        onSearch={this._handleSearch}
        optionLabelProp="value"
        placeholder="Select User"
      >
        {children}
      </AutoComplete>
    );
  }

  private _handleSearch = (value: string) => {
    this.props.userService.searchUsers(value, 0, 10).then(users => {
      this.setState({users});

    });
  }
}

export const UsernameAutoComplete = injectAs<{}>([SERVICES.USER_SERVICE], UsernameAutoCompleteComponent);
