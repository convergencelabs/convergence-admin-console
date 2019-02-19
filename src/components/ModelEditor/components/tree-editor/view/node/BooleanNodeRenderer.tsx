import React, {ReactNode} from "react";
import {BooleanNode} from "../../model/BooleanNode";
import {BooleanEditor} from "../editors/BooleanEditor";
import {
  EditableNodeRendererProps, EditableNodeRendererState,
  EditableNodeRenderer
} from "./EditableNodeRenderer";
import {HighlightRange, Highlighter} from "../highlighter/Highlighter";
import {BooleanSearchResult} from "../../model/search/BooleanSearchResult";
import classNames from "classnames";

export interface BooleanNodeRendererProps extends EditableNodeRendererProps {
  node: BooleanNode;
}

export interface BooleanNodeRendererState extends EditableNodeRendererState {

}

export class BooleanNodeRenderer extends EditableNodeRenderer<BooleanNodeRendererProps, BooleanNodeRendererState> {

  private _span: HTMLSpanElement | null = null;
  private _text: Text | null = null;

  constructor(props: BooleanNodeRendererProps, context: any) {
    super(props, context);
  }

  public render(): ReactNode {
    return super.render();
  }

  protected _getEditComponent(): ReactNode {
    return (
      <BooleanEditor node={this.props.node}
                     onSubmit={this.stopEdit}
                     onCancel={this.stopEdit}
                     onStopEdit={this.stopEdit}
      />
    );
  }

  protected _getRenderComponent(): JSX.Element {
    const value: boolean = this.props.node.element().value();
    const ranges = this._getSearchRanges();

    const active = this.props.node.getActiveSearchResult() instanceof BooleanSearchResult;

    const classes = classNames({
      "value": true,
      "boolean-value": true,
      "active-search": active
    });

    return (
      <div className={classes}>
        <span ref={this._setSpan} onClick={this.startEdit}>{"" + value}</span>
        <Highlighter ranges={ranges}/>
      </div>
    );
  }

  protected _classNames(): {[key: string]: boolean} {
    return Object.assign({"boolean-node": true}, super._classNames());
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
        if (result instanceof BooleanSearchResult) {
          const range: Range = document.createRange();
          range.setStart(this._text!, 0);
          const end = this.props.node.element().value() ? 4 : 5;
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