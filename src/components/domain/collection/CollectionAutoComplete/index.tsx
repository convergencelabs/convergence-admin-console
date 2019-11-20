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
import {injectAs} from "../../../../utils/mobx-utils";
import {SERVICES} from "../../../../services/ServiceConstants";
import {Collection} from "../../../../models/domain/Collection";
import {DomainCollectionService} from "../../../../services/domain/DomainCollectionService";
import {DomainId} from "../../../../models/DomainId";

const {Option} = Select;

export interface CollectionAutoCompleteProps {
  domainId: DomainId;
  disabled?: boolean;
  className?: string;
  onChange?: (username: string) => void;
  placeholder?: string;
  value?: string;
  initialValue?: string;
}

export interface InjectedProps extends CollectionAutoCompleteProps {
  domainCollectionService: DomainCollectionService;
}

export interface CollectionAutoCompleteState {
  collections: Collection[];
  selectedValue: string;
}

export class CollectionAutoCompleteComponent extends Component<InjectedProps, CollectionAutoCompleteState> {

  constructor(props: InjectedProps) {
    super(props);
    this.state = {
      collections: [],
      selectedValue: props.initialValue || ""
    };

    this._onSearch("");
  }

  public render(): ReactNode {
    const {collections} = this.state;
    const {className, placeholder, value} = this.props;
    const inputValue = value !== undefined ? value : this.state.selectedValue;

    const children = collections.map((collection: Collection) =>
      <Option
        key={collection.id}
        value={collection.id}
        title={collection.id}>{collection.id}</Option>);
    return (
      <AutoComplete
        className={className}
        disabled={this.props.disabled}
        onSearch={this._onSearch}
        onChange={this._onChange}
        value={inputValue}
        optionLabelProp="value"
        placeholder={placeholder || "Select Collection"}
      >
        {children}
      </AutoComplete>
    );
  }

  private _onChange = (value: any) => {
    this.setState({selectedValue: value});
    if (this.props.onChange) {
      this.props.onChange(value);
    }
  }

  private _onSearch = (value: string) => {
    this.props.domainCollectionService
      .getCollections(this.props.domainId, value, 0, 10)
      .then(results => {
        this.setState({collections: results.data});
      });
  }
}

export const CollectionAutoComplete = injectAs<CollectionAutoCompleteProps>([SERVICES.DOMAIN_COLLECTION_SERVICE], CollectionAutoCompleteComponent);
