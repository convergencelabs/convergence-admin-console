import React from "react";
import classNames from "classnames";
import {PropertyValidation, OK_PROPERTY_VALIDATION} from "../../validator/PropertyValidator";
import {AutoWidthInputField} from "../common/AutoWidthInputField";

export interface PropertyEditorProps {
  minWidth: number;
  value: string;
  autoFocus: boolean;
  completeOnBlur?: boolean;
  pattern?: RegExp;
  onChange?: (value: string) => void;
  onValidate?: (value: string) => PropertyValidation;
  onComplete: (value: string) => void;
  onCancel: () => void;
}

export interface PropertyEditorState {
  value: string;
  validation: PropertyValidation;
}

export class PropertyEditor extends React.Component<PropertyEditorProps, PropertyEditorState> {

  private readonly _originalProperty: string;

  constructor(props: PropertyEditorProps) {
    super(props);

    this._originalProperty = this.props.value;

    this.state = {
      value: this.props.value,
      validation: this._validate(this.props.value)
    };

    this._onBlur = this._onBlur.bind(this);
    this._onComplete = this._onComplete.bind(this);
    this._onChange = this._onChange.bind(this);
  }

  private _onComplete(): void {
    this.props.onComplete(this.state.value);
  }

  private _onChange(newValue: string): boolean {
    if (this.props.pattern && !this.props.pattern.test(newValue)) {
      return false;
    } else {
      this.setState({
        value: newValue,
        validation: this._validate(newValue)
      });

      if (this.props.onChange) {
        this.props.onChange(newValue);
      }

      return true;
    }
  }

  private _validate(value: string): PropertyValidation {
    if (this._originalProperty === value || !this.props.onValidate) {
      return OK_PROPERTY_VALIDATION;
    } else {
      return this.props.onValidate(value);
    }
  }

  private _onBlur(): void {
    if (this.props.completeOnBlur) {
      this._onComplete();
    }
  }

  public render(): JSX.Element {
    const classes = classNames({
      "property-editor": true,
      error: this.state.validation.status === "error",
      warning: this.state.validation.status === "warning"
    });

    let message = null;
    if (this.state.validation.message) {
      message = <div className="property-editor-message">{this.state.validation.message}</div>;
    }

    return (
      <div className={classes}>
        <AutoWidthInputField
          autoFocus={this.props.autoFocus}
          autoSelect
          type="text"
          value={this.state.value}
          minWidth={20}
          onChange={this._onChange}
          onEnter={this._onComplete}
          onEscape={this.props.onCancel}
          onBlur={this._onBlur}
        />
        {message}
      </div>
    );
  }
}
