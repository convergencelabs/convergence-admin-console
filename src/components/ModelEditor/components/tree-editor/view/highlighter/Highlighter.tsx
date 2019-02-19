import React, {ReactNode} from 'react';
import classNames from "classnames";

export interface HighlightRange {
  range: Range;
  active: boolean;
}

export interface HighlighterProps {
  ranges: HighlightRange[];
}

export interface HighlighterState {
  container: HTMLDivElement | null;
}

export class Highlighter extends React.Component<HighlighterProps, HighlighterState> {

  constructor(props: HighlighterProps) {
    super(props);
    this._setElement = this._setElement.bind(this);
    this.state = {
      container: null
    }
  }

  public renderRange(range: HighlightRange, rangeIndex: number): JSX.Element[] {
    const highlighters: JSX.Element[] = [];
    const rects = range.range.getClientRects();

    for(let i = 0; i < rects.length; i++) {
      const rect: ClientRect = rects[i];
      highlighters.push(this.renderRect(rect, rangeIndex + "." + i, range.active));
    }

    return highlighters;
  }

  public renderRect(rect: ClientRect, key: string, active: boolean): JSX.Element {
    const containerRect: ClientRect = this.state.container!.getBoundingClientRect();
    const style: {[key: string]: any} = {
      top: rect.top - containerRect.top,
      left: rect.left - containerRect.left,
      height: rect.height,
      width: rect.width
    };

    const classes = classNames({
      highlighter: true,
      active: active
    });

    return <div key={key} className={classes} style={style} />
  }

  public render(): ReactNode {
    let highlighters: ReactNode[] = [];

    if (this.state.container) {
      this.props.ranges.forEach((range, index) => {
        highlighters = highlighters.concat(this.renderRange(range, index));
      });
    }

    return (
      <div className="highlighters" ref={this._setElement}>
        {highlighters}
      </div>
    );
  }

  private _setElement(div: HTMLDivElement): void {
    this.setState({container: div})
  }
}
