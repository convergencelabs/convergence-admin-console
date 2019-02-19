import React from 'react';
import classNames from 'classnames';

export interface ChildCountProps {
  visible: boolean,
  count: number
}

export interface ChildCountState {
  increased: boolean;
  decreased: boolean;
}

export class ChildCount extends React.Component<ChildCountProps, ChildCountState> {
  constructor(props: ChildCountProps) {
    super(props);

    this.state = {
      increased: false,
      decreased: false
    };
  }

  // FIXME old react method.
  public componentWillReceiveProps(props: ChildCountProps): void {
    if (props.count !== this.props.count) {
      this.setState({
        increased: props.count > this.props.count,
        decreased: props.count < this.props.count
      });
      setTimeout(() => {
        this.setState({increased: false, decreased: false});
      }, 500);
    }
  }

  public render(): JSX.Element {
    const style = {
      display: this.props.visible ? 'inline' : 'none'
    };
    const classes = classNames({
      'count': true,
      'child-count-increase': this.state.increased,
      'child-count-decrease': this.state.decreased
    });

    return (
      <span className={classes} style={style}>{this.props.count}</span>
    );
  }
}
