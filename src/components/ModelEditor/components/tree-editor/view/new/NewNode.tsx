/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import React, {ReactNode} from 'react';
import {PropertyEditor} from "../editors/PropertyEditor";
import {ModelElementTypes} from "../../../../model/ModelElementTypes";
import {BooleanEditor} from "../editors/BooleanEditor";
import {DateEditor} from "../editors/DateEditor";
import {PropertyValidation} from "../../validator/PropertyValidator";
import {NewStringNode} from "./NewStringNode";
import {NewNumberNode} from "./NewNumberNode";

export interface NewNodeProps {
  label: string;
  labelPattern: RegExp;
  validateProperty: (valud: string) => PropertyValidation;
  onAddChild: (key: string, value: any) => void;
  onCancel: () => void;
  type: string;
}

export interface NewNodeState {
  value: any;
  label: string;
}

export class NewNode extends React.Component<NewNodeProps, NewNodeState> {

  constructor(props: NewNodeProps) {
    super(props);

    this.state = {
      label: props.label || "",
      value: this._getDefaultValue()
    };

    this.onValueChange = this.onValueChange.bind(this);
    this.onPropChange = this.onPropChange.bind(this);
    this.onComplete = this.onComplete.bind(this);
    this.onValidateProperty = this.onValidateProperty.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  private _getDefaultValue(): any {
    switch (this.props.type) {
      case ModelElementTypes.ARRAY:
        return [];
      case ModelElementTypes.OBJECT:
        return {};
      case ModelElementTypes.STRING:
        return "";
      case ModelElementTypes.NUMBER:
        return 0;
      case ModelElementTypes.BOOLEAN:
        return false;
      case ModelElementTypes.DATE:
        return new Date();
      case ModelElementTypes.NULL:
        return null;
    }
  }

  public onValueChange(value: any): void {
    this.setState({
      value: value
    } as NewNodeState);
  }

  public onComplete() {
    try {
      switch (this.props.type) {
        case ModelElementTypes.ARRAY:
          this.props.onAddChild(this.state.label, []);
          break;
        case ModelElementTypes.OBJECT:
          this.props.onAddChild(this.state.label, {});
          break;
        case ModelElementTypes.STRING:
          this.props.onAddChild(this.state.label, this.state.value || "");
          break;
        case ModelElementTypes.NUMBER:
          this.props.onAddChild(this.state.label, this.state.value || 0);
          break;
        case ModelElementTypes.BOOLEAN:
          this.props.onAddChild(this.state.label, this.state.value || false);
          break;
        case ModelElementTypes.DATE:
          this.props.onAddChild(this.state.label, this.state.value || new Date());
          break;
        case ModelElementTypes.NULL:
          this.props.onAddChild(this.state.label, null);
          break;
      }
    } catch (e) {
      if (e.name === 'ValidationException') {
        // this.setState({error: true});
        // const config = this.props.globalConfig;
        // if (config && typeof config.errorCallback === 'function') {
        //   config.errorCallback(e.fullMessage, this.propertyInput);
        // }
      } else {
        throw e;
      }
    }
  }

  public onPropChange(value: string): void {
    this.setState({
      label: value
    } as NewNodeState);
  }

  public onValidateProperty(value: string): PropertyValidation {
    return this.props.validateProperty(value);
  }

  public cancel() {
    this.props.onCancel();
  }

  public render(): ReactNode {
    return (
      <div className="node value-node new-node">
        <span >
          <PropertyEditor minWidth={20}
                          pattern={this.props.labelPattern}
                          value={this.state.label}
                          onCancel={this.cancel}
                          onComplete={this.onComplete}
                          onValidate={this.onValidateProperty}
                          onChange={this.onPropChange}
                          autoFocus
          />
          <span className="colon">:</span>
        </span>
        {this.buildNewNode(this.props.type)}
        <div className="new-node-buttons">
          <i className="fa fa-fw fa-check" onClick={this.onComplete} title="Save new node"/>
          <i className="fa fa-fw fa-remove" onClick={this.cancel} title="Cancel new node"/>
        </div>
      </div>
    );
  }

  private buildNewNode(type: string): ReactNode {
    switch (type) {
      case ModelElementTypes.STRING:
        return <NewStringNode value={this.state.value}
                              onChange={this.onValueChange}
                              onSubmit={this.onComplete}
                              onCancel={this.cancel}
        />;
      case ModelElementTypes.NUMBER:
        return <NewNumberNode minWidth={20}
                              value={this.state.value}
                              onChange={this.onValueChange}
                              onSubmit={this.onComplete}
                              onCancel={this.cancel}
        />;
      case ModelElementTypes.BOOLEAN:
        return <BooleanEditor value={false}
                              onChange={this.onValueChange}
                              onSubmit={this.onComplete}
                              onCancel={this.cancel}
        />;
      case ModelElementTypes.DATE:
        return <DateEditor value={new Date()}
                           onChange={this.onValueChange}
                           onSubmit={this.onComplete}
                           onCancel={this.cancel}
        />;
      case ModelElementTypes.OBJECT:
        return <span>&#123;&#125;</span>;
      case ModelElementTypes.ARRAY:
        return <span>&#91;&#93;</span>;
      case ModelElementTypes.NULL:
        return <span className="value null-value">null</span>;
      default:
        return null;
    }
  }
}
