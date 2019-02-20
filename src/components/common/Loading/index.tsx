import React, {ReactNode} from "react";
import styles from "./styles.module.css";

export class Loading extends React.Component<{ loading: boolean }, {}> {
  render(): ReactNode {
    return (
      <table className={styles.infoTable}>
        <tbody>
        {this.props.children}
        </tbody>
      </table>
    );
  }
}
