import React, {ReactNode} from "react";
import styles from "./styles.module.css";

export class FormButtonBar extends React.Component<{}, {}> {
  render(): ReactNode {
    return (
      <div className={styles.buttons}>
        {this.props.children}
      </div>
    );
  }
}
