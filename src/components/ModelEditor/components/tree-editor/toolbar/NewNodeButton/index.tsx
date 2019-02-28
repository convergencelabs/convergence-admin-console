import React, {ReactNode} from 'react';
import {MenuItem} from "../../../common/MenuItem/";
import {MenuButton} from "../../../common/MenuButton/";
import {ModelElementTypes} from "../../../../model/ModelElementTypes";
import {Subscription} from "rxjs";
import {TreeModel} from "../../model/TreeModel";
import {ContainerNode} from "../../model/ContainerNode";
import {faPlus} from "@fortawesome/free-solid-svg-icons";

export interface NewNodeButtonProps {
  treeModel: TreeModel;
}

export interface NewNodeButtonState {
  enabled: boolean;
}

export class NewNodeButton extends React.Component<NewNodeButtonProps, NewNodeButtonState> {
  private _treeSubscription: Subscription | null;

  constructor(props: NewNodeButtonProps) {
    super(props);
    this.state = {
      enabled: this._isEnabled()
    };

    this._treeSubscription = null;
  }

  public componentWillMount(): void {
    this._treeSubscription = this.props.treeModel.events().subscribe(() => {
      this.setState({ enabled: this._isEnabled()});
    });
  }

  public componentWillUnmount(): void {
    if (this._treeSubscription !== null) {
      this._treeSubscription.unsubscribe();
    }
  }

  newNode(type: string): void {
    this.props.treeModel.addToSelectedNode(type);
  }

  onNewObject = () => {
    this.newNode(ModelElementTypes.OBJECT);
  };

  onNewArray = () => {
    this.newNode(ModelElementTypes.ARRAY);
  };

  onNewString = () => {
    this.newNode(ModelElementTypes.STRING);
  };

  onNewNumber = () => {
    this.newNode(ModelElementTypes.NUMBER);
  };

  onNewBoolean = () => {
    this.newNode(ModelElementTypes.BOOLEAN);
  };

  onNewDate = () => {
    this.newNode(ModelElementTypes.DATE);
  };

  onNewNull = () => {
    this.newNode(ModelElementTypes.NULL);
  };

  private _isEnabled(): boolean {
    return this.props.treeModel.getSelection() instanceof ContainerNode && !this.props.treeModel.isAddingNode();
  }

  public render(): ReactNode {
    return (
      <MenuButton enabled={this.state.enabled} icon={faPlus}>
        <MenuItem label="Object" onClick={this.onNewObject}/>
        <MenuItem label="Array" onClick={this.onNewArray}/>
        <MenuItem label="String" onClick={this.onNewString}/>
        <MenuItem label="Number" onClick={this.onNewNumber}/>
        <MenuItem label="Boolean" onClick={this.onNewBoolean}/>
        <MenuItem label="Date" onClick={this.onNewDate}/>
        <MenuItem label="Null" onClick={this.onNewNull}/>
      </MenuButton>
    );
  }
}
