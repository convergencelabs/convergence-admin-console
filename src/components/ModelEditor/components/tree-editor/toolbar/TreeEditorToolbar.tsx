import React from "react";
import {ReactNode} from "react";
import {ToolbarButton} from "../../common/ToolbarButton/";
import {ToolbarRadioButton} from "../../common/ToolbarRadioButton/";
import {SearchControl} from "./SearchControl/";
import {NewNodeButton} from "./NewNodeButton/";
import {Subscription} from "rxjs";
import {Spacer} from "../../common/Spacer/";
import {EditorMode} from "../../../EditorMode";
import {TreeModel} from "../model/TreeModel";
import styles from "./styles.module.css";

export interface TreeEditorToolbarProps {
  treeModel: TreeModel;
  editMode: EditorMode;
  onModeChanged: (mode: EditorMode) => void;
  onEditSource: () => void;
}

export class TreeEditorToolbar extends React.Component<TreeEditorToolbarProps, {}> {
  private _treeSubscription: Subscription | null;

  constructor(props: TreeEditorToolbarProps, context: any) {
    super(props, context);
    this._treeSubscription = null;
  }

  public componentWillMount(): void {
    this._treeSubscription = this.props.treeModel.events().subscribe(() => {
      this.forceUpdate();
    })
  }

  public componentWillUnmount(): void {
    if (this._treeSubscription !== null) {
      this._treeSubscription.unsubscribe();
    }
  }

  setMode = (mode: EditorMode) => {
    this.props.onModeChanged(mode);
  };

  onDelete = () => {
    this.props.treeModel.deleteSelectedNode();
  };

  onEditSource = () => {
    this.props.onEditSource();
  };

  public render(): ReactNode {
    const deleteEnabled = this.props.editMode === "edit" &&
      this.props.treeModel.getSelection() !== this.props.treeModel.root() &&
      !this.props.treeModel.isAddingNode();

    let edit: ReactNode = null;
    if (this.props.editMode === "edit") {
      edit = (
        <div>
          <Spacer />
          <NewNodeButton treeModel={this.props.treeModel}/>
          <ToolbarButton enabled={deleteEnabled} icon="times" onClick={this.onDelete}/>
        </div>
      );
    }

    return (
      <div className={styles.toolbar}>
        <div className={styles.buttonGroup}>
          <ToolbarRadioButton enabled={!this.props.treeModel.isAddingNode()}
                 selected={this.props.editMode === "view"}
                 icon="eye"
                 tooltip="View"
                 onSelect={() => this.setMode("view")}/>
          <ToolbarRadioButton enabled={!this.props.treeModel.isAddingNode()}
                 selected={this.props.editMode === "edit"}
                 icon="pencil-square-o"
                 tooltip="Edit"
                 onSelect={() => this.setMode("edit")}/>
          <Spacer/>
          <ToolbarButton enabled={!this.props.treeModel.isAddingNode()}
                 icon="plus-square-o"
                 onClick={() => this.props.treeModel.expandAll()}/>
          <ToolbarButton enabled={!this.props.treeModel.isAddingNode()}
                 icon="minus-square-o"
                 onClick={() => this.props.treeModel.collapseAll()}/>
          {edit}
          <Spacer/>
          <ToolbarButton enabled={!this.props.treeModel.isAddingNode()}
                 icon="file-code-o"
                 onClick={this.onEditSource}/>
        </div>
        <SearchControl treeModel={this.props.treeModel}/>
      </div>
    );
  }
}
