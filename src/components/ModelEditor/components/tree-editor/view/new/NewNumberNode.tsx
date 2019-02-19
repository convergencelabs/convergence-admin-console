import React, {ReactNode} from 'react';
import {AutoWidthInputField} from "../common/AutoWidthInputField";

export interface NewNumberNodeProps {
  onCancel: () => void;
  onSubmit: () => void;
  onChange: (value: number) => void;
  value: number;
  minWidth: number;
}

export class NewNumberNode extends React.Component<NewNumberNodeProps, {}> {

  constructor(props: NewNumberNodeProps) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  private onChange(value: string): void {
    const num: number = Number(value);
    this.props.onChange(num);
  }

  public render(): ReactNode {
    return (
      <AutoWidthInputField
        className="number-editor"
        type="number"
        minWidth={this.props.minWidth}
        padding={18}
        value={this.props.value + ""}
        onChange={this.onChange}
        onEscape={this.props.onCancel}
        onEnter={this.props.onSubmit}
      />
    );
  }
}
