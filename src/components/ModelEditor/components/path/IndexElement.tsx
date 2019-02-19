import React, {ReactNode} from 'react';
import {ModelElement} from "../../model/ModelElement";
import {PathClickCallback} from "./PathComponent";

export interface IndexElementProps {
  element: ModelElement<any>;
  onClick: PathClickCallback;
}

export class IndexElement extends React.Component<IndexElementProps, any> {
  constructor(props: IndexElementProps) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  private handleClick(): void {
    this.props.onClick(this.props.element);
  }

  public render(): ReactNode {
    return (
      <span>[<span className="path-idx" onClick={this.handleClick}>{this.props.element.relativePathFromParent()}</span>]</span>
    );
  }
}
