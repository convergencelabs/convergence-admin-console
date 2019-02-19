import React, {ReactNode} from 'react';

export interface NewStringNodeProps {
  onCancel: () => void;
  onSubmit: () => void;
  onChange: (value: string) => void;
  value: string;
}

export class NewStringNode extends React.Component<NewStringNodeProps, {}> {

  private _input: HTMLTextAreaElement | null = null;

  constructor(props: NewStringNodeProps, context: any) {
    super(props, context);

    this._onChange = this._onChange.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
    this._setInput = this._setInput.bind(this);
  }

  public componentDidMount(): void {
    this._input!.scrollTop = 0;
  }

  private _onKeyDown(event: any) {
    if ((event.key === 'Enter' && !event.shiftKey)) {
      this.props.onSubmit();
      event.stopPropagation();
      return false;
    } else if (event.key === 'Escape') {
      this.props.onCancel();
    }
  }

  private _onChange(_: any) {
    this.props.onChange(this._input!.value);
  }

  private _setInput(input: HTMLTextAreaElement) {
    this._input = input;
  }

  public render(): ReactNode {
    const value = this.props.value;
    const lines = value.split("\n").length;

    return (
      <textarea
        className="string-editor"
        value={this.props.value}
        rows={lines}
        ref={this._setInput}
        spellCheck={false}
        onChange={this._onChange}
        onKeyDown={this._onKeyDown}
      />
    );
  }
}
