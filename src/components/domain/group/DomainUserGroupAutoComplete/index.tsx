/*
 * Copyright (c) 2021 - Convergence Labs, Inc.
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
import {DomainId} from "../../../../models/DomainId";
import {DomainGroupService} from "../../../../services/domain/DomainGroupService";
import {DomainUserGroupSummary} from "../../../../models/domain/DomainUserGroupSummary";

const {Option} = Select;

export interface UserGroupAutoCompleteProps {
  domainId: DomainId;
  className: string;
  onChange: (groupId: string) => void;
  placeholder?: string;
  value: string | null;
}

export interface InjectedProps extends UserGroupAutoCompleteProps{
  domainGroupService: DomainGroupService;
}

export interface UserGroupAutoCompleteState {
  groups: DomainUserGroupSummary[];
  selectedValue: string | null;
}

class DomainUserGroupAutoCompleteComponent extends Component<InjectedProps, UserGroupAutoCompleteState> {
  state = {
    groups: [],
    selectedValue: null
  };

  public render(): ReactNode {
    const {groups} = this.state;
    const {className, placeholder, value} = this.props;
    const inputValue = value !== undefined ? value: this.state.selectedValue;

    const children = groups.map((group: DomainUserGroupSummary) =>
      <Option
        key={group.id}
        value={group.id}
        title={group.id}>{group.id}</Option>
    );
    return (
      <Select
        showSearch={true}
        className={className}
        onSearch={this._onSearch}
        onChange={this._onChange}
        value={inputValue === null ? undefined : inputValue}
        optionLabelProp="value"
        placeholder={placeholder || "Select Group"}
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
    this.props.domainGroupService.getUserGroupSummaries(this.props.domainId, value, 0, 10).then(groups => {
      this.setState({groups});
    });
  }
}

const injections = [SERVICES.DOMAIN_GROUP_SERVICE]
export const DomainGroupAutoComplete = injectAs<UserGroupAutoCompleteProps>(injections, DomainUserGroupAutoCompleteComponent);
