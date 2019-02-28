import React, {ReactNode} from "react";
import styles from "./styles.module.css";

export class MessagePage extends React.Component<{}, {}> {
  public render(): ReactNode {
    return (
      <div className={styles.wrapper}>
        <div className={styles.container}>
          {this.props.children}
        </div>
      </div>
    );
  }
}