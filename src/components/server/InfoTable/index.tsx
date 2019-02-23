import React, {ReactNode} from "react";
import styles from "./styles.module.css";

export class InfoTable extends React.Component<{}, {}> {
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

export class InfoTableRow extends React.Component<{ label: string }, {}> {
  public render(): ReactNode {
    return (
      <tr>
        <td>{this.props.label}</td>
        <td>{this.props.children}</td>
      </tr>
    );
  }
}
