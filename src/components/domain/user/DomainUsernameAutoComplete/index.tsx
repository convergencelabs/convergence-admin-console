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
import {Select} from "antd";
import {injectAs} from "../../../../utils/mobx-utils";
import {SERVICES} from "../../../../services/ServiceConstants";
import {DomainUserService} from "../../../../services/domain/DomainUserService";
import {DomainUser} from "../../../../models/domain/DomainUser";
import {DomainId} from "../../../../models/DomainId";

const {Option} = Select;

export interface UserAutoCompleteProps {
  domainId: DomainId;
  className: string;
  onChange: (username: string) => void;
  placeholder?: string;
  value: string | null;
}

export interface InjectedProps extends UserAutoCompleteProps{
  domainUserService: DomainUserService;
}

export interface UsernameAutoCompleteState {
  users: DomainUser[];
  selectedValue: string | null;
}

class DomainUsernameAutoCompleteComponent extends Component<InjectedProps, UsernameAutoCompleteState> {
  state = {
    users: [],
    selectedValue: null
  };

  public render(): ReactNode {
    const {users} = this.state;
    const {className, placeholder, value} = this.props;
    const inputValue = value !== undefined ? value: this.state.selectedValue;

    const children = users.map((user: DomainUser) =>
      <Option
        key={user.username}
        value={user.username}
        title={user.username}>{user.displayName} ({user.username})
      </Option>);
    return (
      <Select
        showSearch={true}
        className={className}
        onSearch={this._onSearch}
        onChange={this._onChange}
        value={inputValue === null ? undefined : inputValue}
        optionLabelProp="value"
        placeholder={placeholder || "Select User"}
        notFoundContent={null}
        filterOption={false}
        showArrow={false}
      >
        {children}
      </Select>
    );
  }

  private _onChange = (value: any) => {
    this.setState({selectedValue: value});
    this.props.onChange(value);
  }

  private _onSearch = (value: string) => {
    this.props.domainUserService.getUsers(this.props.domainId, value, 0, 10).then(users => {
      this.setState({users});
    });
  }
}

const injections = [SERVICES.DOMAIN_USER_SERVICE]
export const DomainUsernameAutoComplete = injectAs<UserAutoCompleteProps>(injections, DomainUsernameAutoCompleteComponent);
