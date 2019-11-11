import React, {ReactNode} from "react";
import {createTreeElementRoot, ModelRoot} from "./model/ModelFactory";
import {createTreeNode} from "./components/tree-editor/model/TreeNodeFactory";
import {PathControlModel, PathElementSelectionEvent} from "./components/path/PathControlModel";
import {EditorMode} from "./EditorMode";
import {SapphireEditorComponent} from "./SapphireEditorComponent";
import {TreeNode} from "./components/tree-editor/model/TreeNode";
import {TreeModel, TreeModelSelectionEvent} from "./components/tree-editor/model/TreeModel";
import {ObjectNode} from "./components/tree-editor/model/ObjectNode";

export interface SapphireEditorProps {
  data: ModelRoot;
  confirmDelete?: (element: TreeNode<any>) => Promise<boolean>;
  defaultMode: EditorMode;
  rootLabel: string;
}

export class SapphireEditor extends React.Component<SapphireEditorProps, {}> {
  private readonly _treeModel: TreeModel;
  private readonly _pathModel: PathControlModel;

  constructor(props: SapphireEditorProps) {
    super(props);
    const editable: boolean = props.defaultMode === "edit";
    this._treeModel = new TreeModel({
      confirmDelete: props.confirmDelete,
      editable: editable
    });

    const treeData = createTreeElementRoot(props.data);
    const rootNode = createTreeNode(this._treeModel, null, treeData) as ObjectNode;
    this._treeModel.setRoot(rootNode);

    this._treeModel.expandToDepth(1);
    this._treeModel.selectNode(this._treeModel.root());
    this._treeModel.setEditable(editable);

    this._pathModel = new PathControlModel(props.rootLabel, treeData, treeData);

    this._pathModel.events().subscribe(e => {
      if (e instanceof PathElementSelectionEvent) {
        if (e.element !== null) {
          const node = this._treeModel.getNodeAtPath(e.element.path());
          this._treeModel.selectNode(node);
        } else {
          this._treeModel.selectNode(null);
        }
      }
    });

    this._treeModel.events().subscribe(e => {
      if (e instanceof TreeModelSelectionEvent) {
        if (e.node !== null) {
          this._pathModel.setSelectedElement(e.node.element());
        } else {
          this._pathModel.setSelectedElement(null);
        }
      }
    });
  }

  public render(): ReactNode {
    return (<SapphireEditorComponent
      treeModel={this._treeModel}
      pathModel={this._pathModel}
      defaultMode={this.props.defaultMode}
      defaultView="tree"
    />);
  }
}
