import React, {ReactNode} from "react";
import {ToolbarButton} from "../../common/ToolbarButton/";
import styles from "./styles.module.css";
import { faSave } from "@fortawesome/free-regular-svg-icons";

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
      save = <ToolbarButton icon={faSave} enabled={this.props.canSaveSource} onClick={this.onSaveSource} />;
    }

    return <div className={styles.toolbar}>
      {save}
      <span style={{flex: 1}} />
      <ToolbarButton icon={faSave} enabled onClick={this.onCancelSource} />
    </div>;
  }

  private onSaveSource = () => {
    this.props.onSaveSource({});
  };

  private onCancelSource = () => {
    this.props.onCancelSource();
  };
}
