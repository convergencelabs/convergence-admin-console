import React, {ReactNode} from "react";
import {ToolbarButton} from "../toolbar/ToolbarButton";

export interface SourceEditorToolbarProps {
  onSaveSource: (data: {[key: string]: any}) => void;
  onCancelSource: () => void;
  canSaveSource: boolean;
  editable: boolean;
}

export class SourceEditorToolbar extends React.Component<SourceEditorToolbarProps, {}> {

  public render(): ReactNode {
    let save = null;
    if (this.props.editable) {
      save = <ToolbarButton icon="floppy-o" enabled={this.props.canSaveSource} onClick={this.onSaveSource} />;
    }

    return <div className="sapphire-toolbar">
      {save}
      <span style={{flex: 1}} />
      <ToolbarButton icon="window-close" enabled onClick={this.onCancelSource} />
    </div>;
  }

  private onSaveSource = () => {
    this.props.onSaveSource({});
  };

  private onCancelSource = () => {
    this.props.onCancelSource();
  };
}
