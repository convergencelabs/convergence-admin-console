import React, {ReactNode} from "react";
import {StringNode} from "../../model/StringNode";
import {StringEditor} from "../editors/StringEditor";
import {
  EditableNodeRenderer, EditableNodeRendererProps,
  EditableNodeRendererState
} from "./EditableNodeRenderer";
import {Highlighter, HighlightRange} from "../highlighter/Highlighter";
import {StringSearchResult} from "../../model/search/StringSearchResult";

export interface StringNodeRendererProps extends EditableNodeRendererProps {
  node: StringNode;
}

export interface StringNodeRendererState extends EditableNodeRendererState {
}

export class StringNodeRenderer extends EditableNodeRenderer<StringNodeRendererProps, StringNodeRendererState> {

  private _contentElement: HTMLDivElement | null;
  private _text: Text | null;

  constructor(props: StringNodeRendererProps, context: any) {
    super(props, context);
    this._setElement = this._setElement.bind(this);
    this._text = null;
    this._contentElement = null;
  }

  private _setElement(e: HTMLDivElement) {
    this._contentElement = e;
    if (this._contentElement) {
      this._text = this._contentElement.firstChild as Text;
      this.forceUpdate();
    } else {
      this._text = null;
    }
  }

  public render(): ReactNode {
    return super.render();
  }

  protected _getEditComponent(): ReactNode {
    return (<StringEditor node={this.props.node} onStopEdit={this.stopEdit}/>);
  }

  protected _getRenderComponent(): ReactNode {
    let value: string = this.props.node.element().value();
    // Hack to make sure we get the last newline rendered.
    if (value.endsWith("\n")) {
      value = value + "\n";
    }
    const ranges = this._getSearchRanges();
    const v = value.length > 0 ? value : '\u00A0';
    return (
      <div className="value string-value">
        <div onMouseMove={this.startEdit} ref={this._setElement}>{v}</div>
        <Highlighter ranges={ranges}/>
      </div>
    );
  }

  protected _classNames(): {[key: string]: boolean} {
    return Object.assign({"string-node": true}, super._classNames());
  }

  private _getSearchRanges(): HighlightRange[] {
    const ranges: HighlightRange[] = [];
    if (this._text) {
      const active = this.props.node.getActiveSearchResult();
      this.props.node.searchResults().forEach(result => {
        if (result instanceof StringSearchResult) {
          const range: Range = document.createRange();
          range.setStart(this._text!, result.start());
          range.setEnd(this._text!, result.end());
          ranges.push({
            range: range,
            active: result === active
          });
        }
      });
    }
    return ranges;
  }
}
