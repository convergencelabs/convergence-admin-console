import React, {KeyboardEvent, ReactNode} from 'react';
import {Subscription} from "rxjs";
import {StringNode} from "../../model/StringNode";
import StringChangeDetector from "@convergence/string-change-detector";
import {ModelElementEvent, ModelElementMutationEvent} from "../../../../model/ModelElement";
import {StringInsertEvent, StringRemoveEvent, StringValueEvent} from "../../../../model/StringElement";

export interface StringEditorProps {
  onStopEdit: () => void;
  node: StringNode;
}

export interface StringEditorState {
  value: string;
}

export type TextAreaSelection = {start: number, end: number};

export class StringEditor extends React.Component<StringEditorProps, StringEditorState> {

  private _input: HTMLTextAreaElement | null = null;
  private changeDetector: StringChangeDetector| null = null;
  private _nodeSubscription: Subscription | null = null;

  constructor(props: StringEditorProps) {
    super(props);
    this.state = {
      value: this.props.node.element().value()
    };

    this._onChange = this._onChange.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onMouseLeave = this._onMouseLeave.bind(this);
    this._setInput = this._setInput.bind(this);
  }

  public componentDidMount(): void {
    this._input!.scrollTop = 0;
    // FIXME this event casting is problematic.
    this._nodeSubscription = this.props.node.element()
      .events()
      .subscribe((e: ModelElementEvent) => this._handleModelElementEvent(e as ModelElementMutationEvent));

    this.changeDetector = new StringChangeDetector({
      value: this.props.node.element().value(),
      onInsert: (index, value) => {
        this.props.node.element().insert(index, value);
      },
      onRemove: (index, length) => {
        this.props.node.element().remove(index, length);
      }
    });
  }

  public componentWillUnmount(): void {
    if (this._nodeSubscription) {
      this._nodeSubscription.unsubscribe();
    }
  }

  public render(): ReactNode {
    const value: string = this.state.value;
    const lines: number = value.split("\n").length;

    return (
      <textarea
        className="string-editor"
        value={value}
        rows={lines}
        ref={this._setInput}
        spellCheck={false}
        onChange={this._onChange}
        onKeyDown={this._onKeyDown}
        onMouseLeave={this._onMouseLeave}
        onBlur={this.props.onStopEdit}
      />
    );
  }

  private _setInput(input: HTMLTextAreaElement) {
    this._input = input;
  }

  private _handleModelElementEvent(e: ModelElementMutationEvent) {
    if (!e.remote) {
      return;
    }

    const selection: TextAreaSelection = {
      start: this._input!.selectionStart,
      end: this._input!.selectionEnd,
    };
    const xFormed: TextAreaSelection = StringEditor.transformSelection(selection, e);
    this.setState({
        value: this.props.node.element().value()
      },
      () => {
        this.changeDetector!.setValue(this.state.value);
        this._input!.setSelectionRange(xFormed.start, xFormed.end);
      });
  }

  private _onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>): void {
    if ((event.key === 'Enter' && !event.shiftKey) || event.key === 'Escape') {
      this.props.onStopEdit();
      event.stopPropagation();
      event.preventDefault();
    }
  }

  private _onChange(): void {
    const value: string = this._input!.value;
    this.changeDetector!.processNewValue(value);
    this.setState({value});
  }

  private _onMouseLeave(): void {
    if (this._input !== document.activeElement) {
      this.props.onStopEdit();
    }
  }

  static transformSelection(selection: TextAreaSelection, event: ModelElementMutationEvent): TextAreaSelection {
    return {
      start: StringEditor.transformIndex(selection.start, event),
      end: StringEditor.transformIndex(selection.end, event)
    };
  }

  static transformIndex(index: number, event: ModelElementMutationEvent) {
    if (event instanceof StringInsertEvent) {
      if (event.index <= index) {
        return index + event.value.length;
      }
      return index;
    } else if (event instanceof StringRemoveEvent) {
      const removeIndex: number = event.index;
      if (index > removeIndex) {
        return index - Math.min(index - removeIndex,  event.length);
      }
      return index;
    } else if (event instanceof StringValueEvent) {
      return 0;
    }
    throw new Error("Invalid operation type");
  }
}
