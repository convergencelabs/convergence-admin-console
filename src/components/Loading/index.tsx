import * as React from 'react';
import styles from "./styles.module.css";
import {Component, ReactNode} from "react";

export class Loading extends Component<{loading: boolean}, {}> {
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
