import React from 'react';
import {BooleanNode} from "../../model/BooleanNode";

export interface BooleanEditorProps {
  onStopEdit?: () => void;
  onSubmit?: () => void;
  onCancel?: () => void;
  value?: boolean;
  node?: BooleanNode,
  onChange?: (value: boolean) => void;
}

export class BooleanEditor extends React.Component<BooleanEditorProps, {}> {

  private _input: HTMLSelectElement | null = null;

  constructor(props: BooleanEditorProps) {
    super(props);

    this.onBlur = this.onBlur.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
  }

  onKeyDown(event: any) {
    if (event.key === 'Enter') {
      if (this.props.onSubmit) {
        this.props.onSubmit();
      }
      event.stopPropagation();
      return false;
    } else if (event.key === 'Escape') {
      if (this.props.onCancel) {
        this.props.onCancel();
      }
    }
  }

  onChange(event: any) {
    const value = this._input!.selectedOptions[0].value === "true";

    if (this.props.onChange) {
      this.props.onChange(value);
    }

    // We are editing an existing node.
    if (this.props.node) {
      this.props.node.element().value(value);
    }
  }

  onBlur(event: any) {
    if (this.props.onStopEdit) {
      this.props.onStopEdit();
    }
  }

  private onMouseLeave(): void {
    if (this._input !== document.activeElement) {
      if (this.props.onStopEdit) {
        this.props.onStopEdit();
      }
    }
  }

  render() {
    let value: boolean = false;
    if (this.props.node !== undefined) {
      value = this.props.node.element().value();
    } else {
      value = this.props.value!;
    }

    return (
      <select className="boolean-editor"
              ref={e => this._input = e}
              autoFocus={this.props.node !== undefined}
              onChange={this.onChange}
              onBlur={this.onBlur}
              onKeyDown={this.onKeyDown}
              defaultValue={value + ""}
              onMouseLeave={this.onMouseLeave}
      >
        <option value="true">true</option>
        <option value="false">false</option>
      </select>
    );
  }
}
