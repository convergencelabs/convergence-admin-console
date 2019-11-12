/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import React, {ReactNode} from "react";
import {ContainerNodeRenderer, ContainerNodeRendererProps, ContainerNodeRendererState} from "./ContainerNodeRenderer";
import {createNodeRenderer} from "./NodeRendererFactory";
import {ArrayNode} from "../../model/ArrayNode";

export interface ArrayNodeRendererProps extends ContainerNodeRendererProps {
  node: ArrayNode;
}

export interface ArrayNodeRendererState extends ContainerNodeRendererState {
}

export class ArrayNodeRenderer extends ContainerNodeRenderer<ArrayNodeRendererProps, ArrayNodeRendererState> {

  constructor(props: ArrayNodeRendererProps, context: any) {
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
    const children: ReactNode[] = [];

    this.props.node.forEach((key, node) => {
      const child = createNodeRenderer(key + "", node, true, this._propertyPattern());
      children.push(child);
    });

    return children;
  }

  protected _renderChildrenOpen(): ReactNode {
    return <span className="open-brace">[</span>;
  }

  protected _renderChildrenClose(): ReactNode {
    return <span className="close-brace">]</span>;
  }

  protected _addChild(key: any, value: any): void {
    let index: number;
    if (key.length === 0) {
      index = 0
    } else {
      index = Math.min(Number(key), this.props.node.size());
    }
    this.props.node.element().insert(index, value);
  }

  protected _propertyPattern(): RegExp {
    return /^$|^0$|^[1-9][\d]*$/;
  }

  protected _getDefaultNewNodeLabel(): string {
    return this.props.node.size() + "";
  }
}
