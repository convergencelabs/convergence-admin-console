import * as React from 'react';
import {Component, ReactNode} from 'react';
import {AutoComplete, Select} from "antd";
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
  value?: string;
}

export interface InjectedProps extends UserAutoCompleteProps{
  domainUserService: DomainUserService;
}

export interface UsernameAutoCompleteState {
  users: DomainUser[];
  selectedValue: string;
}

class DomainUsernameAutoCompleteComponent extends Component<InjectedProps, UsernameAutoCompleteState> {
  state = {
    users: [],
    selectedValue: ""
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
    this.props.domainUserService.getUsers(this.props.domainId, value, 0, 10).then(users => {
      this.setState({users});

    });
  }
}

const injections = [SERVICES.DOMAIN_USER_SERVICE]
export const DomainUsernameAutoComplete = injectAs<UserAutoCompleteProps>(injections, DomainUsernameAutoCompleteComponent);
