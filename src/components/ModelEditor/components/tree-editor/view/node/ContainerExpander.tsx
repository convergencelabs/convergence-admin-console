import React from 'react';
import classNames from 'classnames';

export interface ContainerExpanderProps {
  expanded: boolean,
  onToggle: () => void
}

export class ContainerExpander extends React.Component<ContainerExpanderProps, any> {
  render() {
    let expanderClass = classNames({
      'expander fa fa-fw': true,
      'fa-plus-square-o': !this.props.expanded,
      'fa-minus-square-o': this.props.expanded
    });
    return (
      <span className={expanderClass} onClick={this.props.onToggle}/>
    );
  }
}
