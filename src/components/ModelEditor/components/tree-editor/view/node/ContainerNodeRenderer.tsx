import React, {ReactNode} from "react";
import classNames from 'classnames';
import {ContainerExpander} from "./ContainerExpander";
import {ChildCount} from "./ChildCount";
import {NodeRenderer, NodeRendererProps, NodeRendererState} from "./NodeRenderer";
import {NewNode} from "../new/NewNode";
import {PropertyValidator, PropertyValidation} from "../../validator/PropertyValidator";
import {SapphireEvent} from "../../../../SapphireEvent";
import {ContainerNode, NewNodeStateEvent, NodeCollapsedEvent, NodeExpandedEvent} from "../../model/ContainerNode";



export interface ContainerNodeRendererProps extends NodeRendererProps {
  node: ContainerNode<any>;
}

export interface ContainerNodeRendererState extends NodeRendererState {
  expanded: boolean;
  newNode: string | null;
}

export abstract class ContainerNodeRenderer<P extends ContainerNodeRendererProps, S extends ContainerNodeRendererState> extends NodeRenderer<P, S> {

  protected constructor(props: P, context: any) {
    super(props, context);

    this._handleExpanderToggle = this._handleExpanderToggle.bind(this);
    this.onConfirmAdd = this.onConfirmAdd.bind(this);
    this.onCancelAdd = this.onCancelAdd.bind(this);
    this._validateProperty = this._validateProperty.bind(this);
  }

  protected _processNodeEvents(e: SapphireEvent): void {
    super._processNodeEvents(e);
    if (e instanceof NodeExpandedEvent) {
      this.setState({expanded: true} as S);
    } else if (e instanceof NodeCollapsedEvent) {
      this.setState({expanded: false} as S);
    } else if (e instanceof NewNodeStateEvent) {
      this.setState({newNode: e.type} as S);
    }
  }

  private _handleExpanderToggle(): void {
    this.props.node.toggleExpanded();
  }

  private onConfirmAdd(key: any, value: any): void {
    this.props.node.tree().clearAddingNode();
    this._addChild(key, value);
  }

  private onCancelAdd(): void {
    this.props.node.tree().clearAddingNode();
  }

  public _renderValue(): ReactNode {
    const children: ReactNode[] = this._renderChildren();

    let newNode = null;
    if (this.state.newNode !== null) {
        newNode = <NewNode key="new-node"
                 labelPattern={this._propertyPattern()}
                 type={this.state.newNode!}
                 label={this._getDefaultNewNodeLabel()}
                 validateProperty={this._validateProperty}
                 onAddChild={this.onConfirmAdd}
                 onCancel={this.onCancelAdd}
        />;
    }
    const childrenStyle = {display: this.state.expanded ? 'block' : 'none'};

    return (
      <div className="container-value">
        <ContainerExpander expanded={this.state.expanded} onToggle={this._handleExpanderToggle}/>
        {this._renderChildrenOpen()}
        <div className="children" style={childrenStyle}>
          {children}
          {newNode}
        </div>
        <ChildCount visible={!this.state.expanded} count={this._childCount()}/>
        {this._renderChildrenClose()}
      </div>
    );
  }

  protected _classNames(): any {
    return classNames({
      'node': true,
      'node-container': true,
      'editable-node': true
    });
  }

  protected abstract _childCount(): number;

  protected abstract _renderChildren(): ReactNode[];

  protected abstract _renderChildrenOpen(): ReactNode;

  protected abstract _renderChildrenClose(): ReactNode;

  protected abstract _addChild(key: any, value: any): void;

  protected abstract _propertyPattern(): RegExp;

  protected abstract _getDefaultNewNodeLabel(): string;

  protected _validateProperty(value: string): PropertyValidation {
    return PropertyValidator.validate(this.props.node, value);
  }
}
