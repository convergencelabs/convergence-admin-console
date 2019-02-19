import {createNodeRenderer} from "./NodeRendererFactory";
import {
  ContainerNodeRenderer,
  ContainerNodeRendererProps,
  ContainerNodeRendererState
} from "./ContainerNodeRenderer";
import {ObjectNode} from "../../model/ObjectNode";
import React, {ReactElement, ReactNode} from "react";

export interface ObjectNodeRendererProps extends ContainerNodeRendererProps {
  node: ObjectNode;
}

export interface ObjectNodeRendererState extends ContainerNodeRendererState {
}

export class ObjectNodeRenderer extends ContainerNodeRenderer<ObjectNodeRendererProps, ObjectNodeRendererState> {

  constructor(props: ObjectNodeRendererProps, context: any) {
    super(props, context);

    this.state = {
      expanded: this.props.node.isExpanded(),
      selected: this.state.selected,
      newNode: null
    };
  }

  public render(): ReactNode {
    return super.render();
  }

  protected _childCount(): number {
    return this.props.node.size();
  }

  protected _renderChildren(): ReactNode[] {
    const children: ReactElement<any>[] = [];
    this.props.node.forEach((key, node) => {
      const child = createNodeRenderer(key, node, true, this._propertyPattern());
      children.push(child);
    });

    children.sort((a: ReactElement<any>, b: ReactElement<any>) => {
      const k1 = a.props.label.toLowerCase();
      const k2 = b.props.label.toLowerCase();
      return (k1 < k2) ? -1 : ((k1 > k2) ? 1 : 0);
    });

    return children;
  }

  protected _renderChildrenOpen(): ReactNode {
    return <span className="open-brace">{'{'}</span>;
  }

  protected _renderChildrenClose(): ReactNode {
    return <span className="close-brace">{'}'}</span>
  }

  protected _addChild(key: any, value: any): void {
    this.props.node.element().set(key + "", value);
  }

  protected _propertyPattern(): RegExp {
    return /^[\s\S]*$/;
  }

  protected _getDefaultNewNodeLabel(): string {
    return "";
  }
}
