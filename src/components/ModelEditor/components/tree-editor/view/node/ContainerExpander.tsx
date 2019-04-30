import React, {ReactNode} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlusSquare, faMinusSquare} from "@fortawesome/free-regular-svg-icons";

export interface ContainerExpanderProps {
  expanded: boolean,
  onToggle: () => void
}

export class ContainerExpander extends React.Component<ContainerExpanderProps, any> {
  public render(): ReactNode {
    const icon = this.props.expanded ? faMinusSquare : faPlusSquare;
    return (
      <span className="expander" onClick={this.props.onToggle}>
        <FontAwesomeIcon icon={icon} fixedWidth/>
      </span>
    );
  }
}
