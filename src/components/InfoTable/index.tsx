import * as React from 'react';
import styles from "./styles.module.css";
import {Component, ReactNode} from "react";

export class InfoTable extends Component<{}, {}> {
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

export class InfoTableRow extends Component<{ label: string }, {}> {
  public render(): ReactNode {
    return (
      <tr>
        <td>{this.props.label}</td>
        <td>{this.props.children}</td>
      </tr>
    );
  }
}
