import React, {ReactNode} from "react";
import {DateNode} from "../../model/DateNode";
import {EditableNodeRenderer, EditableNodeRendererProps, EditableNodeRendererState} from "./EditableNodeRenderer";
import {DateEditor} from "../editors/DateEditor";
import {Highlighter, HighlightRange} from "../highlighter/Highlighter";
import {DateSearchResult} from "../../model/search/DateSearchResult";
import classNames from "classnames";
import {DateUtils} from "../../../../utils/DateUtils";


export interface DateNodeRendererProps extends EditableNodeRendererProps {
  node: DateNode;
}

export interface DateNodeRendererState extends EditableNodeRendererState {

}

export class DateNodeRenderer extends EditableNodeRenderer<DateNodeRendererProps, DateNodeRendererState> {
  private _span: HTMLSpanElement | null = null;
  private _text: Text | null = null;

  public render(): ReactNode {
    return super.render();
  }

  protected _getEditComponent(): ReactNode {
    return (
      <DateEditor node={this.props.node}
                  onSubmit={this.stopEdit}
                  onCancel={this.stopEdit}
                  onStopEdit={this.stopEdit}
      />
    );
  }

  protected _getRenderComponent(): JSX.Element {
    const value: Date = this.props.node.element().value();

    const ranges = this._getSearchRanges();
    const active = this.props.node.getActiveSearchResult() instanceof DateSearchResult;
    const dateStr = DateUtils.formatDate(value);

    const classes = classNames({
      "value": true,
      "date-value": true,
      "active-search": active
    });

    return (
      <div className={classes}>
        <span ref={this._setSpan} onMouseMove={this.startEdit}>{dateStr}</span>
        <Highlighter ranges={ranges}/>
      </div>
    );
  }

  protected _classNames(): { [key: string]: boolean } {
    return Object.assign({"date-node": true}, super._classNames());
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
        if (result instanceof DateSearchResult) {
          const range: Range = document.createRange();
          range.setStart(this._text!, 0);
          const dateStr = DateUtils.formatDate(this.props.node.element().value());
          const end = dateStr.length;
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
