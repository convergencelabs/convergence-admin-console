import * as React from 'react';
import {Component, ReactNode} from "react";
import {AutoComplete} from "antd";
import {Select} from "antd";
import {injectAs} from "../../../utils/mobx-utils";
import {SERVICES} from "../../../services/ServiceConstants";
import {NamespaceService} from "../../../services/NamespaceService";
import {NamespaceAndDomains} from "../../../models/NamespaceAndDomains";

const {Option} = Select;

export interface NamespaceAutoCompleteProps {
  disabled?: boolean;
  className?: string;
  onChange?: (username: string) => void;
  placeholder?: string;
  value?: string;
}

export interface InjectedProps extends NamespaceAutoCompleteProps{
  namespaceService: NamespaceService;
}

export interface NamespaceAutoCompleteState {
  namespaces: NamespaceAndDomains[];
  selectedValue: string;
}

export class NamespaceAutoCompleteComponent extends Component<InjectedProps, NamespaceAutoCompleteState> {
  state = {
    namespaces: [],
    selectedValue: ""
  };

  public render(): ReactNode {
    const {namespaces} = this.state;
    const {className, placeholder, value} = this.props;
    const inputValue = value !== undefined ? value: this.state.selectedValue;

    const children = namespaces.map((namespace: NamespaceAndDomains) =>
      <Option
        key={namespace.id}
        value={namespace.id}
        title={namespace.id}>{namespace.displayName} ({namespace.id})
      </Option>);
    return (
      <AutoComplete
        className={className}
        disabled={this.props.disabled}
        onSearch={this._onSearch}
        onChange={this._onChange}
        value={inputValue}
        optionLabelProp="value"
        placeholder={placeholder || "Select Namespace"}
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
    this.props.namespaceService.getNamespaces(value, 0, 10).then(namespaces => {
      this.setState({namespaces});
    });
  }
}

export const NamespaceAutoComplete = injectAs<NamespaceAutoCompleteProps>([SERVICES.NAMESPACE_SERVICE], NamespaceAutoCompleteComponent);
