import React, {ReactNode} from "react";
import {NumberNode} from "../../model/NumberNode";
import {NumberEditor} from "../editors/NumberEditor";
import {EditableNodeRenderer, EditableNodeRendererProps, EditableNodeRendererState} from "./EditableNodeRenderer";
import {Highlighter, HighlightRange} from "../highlighter/Highlighter";
import {NumberSearchResult} from "../../model/search/NumberSearchResult";
import classNames from "classnames";


export interface NumberNodeRendererProps extends EditableNodeRendererProps {
  node: NumberNode;
}

export interface NumberNodeRendererState extends EditableNodeRendererState {
}

export class NumberNodeRenderer extends EditableNodeRenderer<NumberNodeRendererProps, NumberNodeRendererState> {
  private _span: HTMLSpanElement | null = null;
  private _text: Text | null = null;

  public render(): ReactNode {
    return super.render();
  }

  protected _getEditComponent(): ReactNode {
    return (
      <NumberEditor node={this.props.node}
                    minWidth={20}
                    onStopEdit={this.stopEdit}
      />
    );
  }

  protected _getRenderComponent(): JSX.Element {
    const value: number = this.props.node.element().value();
    const ranges = this._getSearchRanges();

    const active = this.props.node.getActiveSearchResult() instanceof NumberSearchResult;

    const classes = classNames({
      "value": true,
      "number-value": true,
      "active-search": active
    });

    return (
      <div className={classes}>
        <span ref={this._setSpan} onMouseMove={this.startEdit}>{"" + value}</span>
        <Highlighter ranges={ranges}/>
      </div>
    );
  }

  protected _classNames(): {[key: string]: boolean} {
    return Object.assign({"number-node": true}, super._classNames());
  }

  private _setSpan = (span: HTMLSpanElement) => {
    this._span = span;
    if (this._span) {
      this._text = this._span.firstChild as Text;
    } else {
      this._text = null;
    }
  };

  private _getSearchRanges(): HighlightRange[] {
    const ranges: HighlightRange[] = [];
    if (this._text) {
      const active = this.props.node.getActiveSearchResult();
      this.props.node.searchResults().forEach(result => {
        if (result instanceof NumberSearchResult) {
          const range: Range = document.createRange();
          range.setStart(this._text!, 0);
          const end = ("" + this.props.node.element().value()).length;
          range.setEnd(this._text!, end);
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