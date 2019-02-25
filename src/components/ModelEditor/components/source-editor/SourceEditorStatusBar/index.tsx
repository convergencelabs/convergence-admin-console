import React, {ReactNode} from "react";
import classNames from "classnames";

export type SourceStatus = "error" | "warning";
export const SOURCE_STATUS_ERROR: SourceStatus = "error";
export const SOURCE_STATUS_WARNING: SourceStatus = "warning";

import styles from "./styles.module.scss";

export interface SourceEditorStatusBarProps {
  cursor: {row: number, col: number};
  status: SourceStatus | null;
  statusMessage: string;
}

export class SourceEditorStatusBar extends React.Component<SourceEditorStatusBarProps, {}> {

  public render(): ReactNode {
    let icon: ReactNode = null;
    if (this.props.status) {
      const c: any = {
        fa: true
      };

      if (this.props.status === SOURCE_STATUS_WARNING) {
        c.warning = true;
        c['fa-exclamation-triangle'] = true;
      } else if (this.props.status === SOURCE_STATUS_ERROR) {
        c.error = true;
        c['fa-times-circle'] = true;
      }

      const classes = classNames(c);
      icon = (<i className={classes} aria-hidden="true"/>);
    }

    return (
      <div className={styles.statusBar}>
        {icon}
        <span className="message">{this.props.statusMessage}</span>
        <span className={styles.cursorInfo}>{this.props.cursor.row}:{this.props.cursor.col}</span>
      </div>
    );
  }
}
