import React, {MouseEvent, FocusEvent, ReactNode} from 'react';

export interface AutoWidthInputFieldProps {
  value: string;
  type: string;

  className?: string;

  onEscape?: () => void;
  onEnter?: () => void;
  onChange?: (value: string) => void;
  onMouseLeave?: (event: MouseEvent<HTMLInputElement>) => void;
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;

  autoFocus?: boolean;
  autoSelect?: boolean;
  padding?: number;
  minWidth: number;
}

export class AutoWidthInputField extends React.Component<AutoWidthInputFieldProps, {}> {

  private _input: HTMLInputElement | null = null;
  private _canvas: HTMLCanvasElement | null = null;
  private _canvasContext: CanvasRenderingContext2D | null = null;

  constructor(props: AutoWidthInputFieldProps) {
    super(props);

    this._onChange = this._onChange.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
    this._setInput = this._setInput.bind(this);
  }

  public componentDidMount(): void {
    if (this.props.autoFocus) {
      this._input!.focus();
    }

    if (this.props.autoSelect) {
      this._input!.setSelectionRange(0, this._input!.value.length)
    }
  }

  public render(): ReactNode {
    const width = this._computeTextWidth();
    const editorStyle = {
      width
    };

    return (
      <input
        className={this.props.className}
        type={this.props.type}
        style={editorStyle}
        value={this.props.value}
        ref={this._setInput}
        spellCheck={false}
        onChange={this._onChange}
        onKeyDown={this._onKeyDown}
        onMouseLeave={this.props.onMouseLeave}
        onBlur={this.props.onBlur}
      />
    );
  }

  private _onKeyDown(event: any): boolean {
    if (event.key === 'Enter') {
      if (this.props.onEnter) {
        this.props.onEnter();
      }
      event.stopPropagation();
      return false;
    } else if (event.key === 'Escape') {
      if (this.props.onEscape) {
        this.props.onEscape();
      }
    }

    return true;
  }

  private _onChange(): void {
    if (this.props.onChange) {
      this.props.onChange(this._input!.value);
    }
  }

  private _setInput(e: HTMLInputElement): void {
    this._input = e;
    if (this._input) {
      const computedStyle = window.getComputedStyle(this._input, null);
      const font = computedStyle.fontFamily;
      const size = computedStyle.fontSize;
      this._canvas = document.createElement('canvas');
      this._canvasContext = this._canvas.getContext("2d");
      this._canvasContext!.font = size + " " + font;
      this.forceUpdate();
    }
  }

  private _computeTextWidth(): number {
    if (!this._canvasContext) {
      return this.props.minWidth;
    }
    let width = this._canvasContext.measureText(this.props.value).width;
    if (this.props.padding) {
      width = width + this.props.padding;
    }
    return Math.max(width, this.props.minWidth);
  }
}
