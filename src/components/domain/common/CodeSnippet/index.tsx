import * as React from 'react';
import {Component, ReactNode} from "react";
import Highlight from "react-highlight";
import styles from "./styles.module.css";

export class CodeSnippet extends Component<{},{}> {
  public render(): ReactNode {
    return (
      <div className={styles.codeSnippet}>
        {this.props.children}
      </div>
    )
  }
}

export class CodeSnippetDescription extends Component<{},{}> {
  public render(): ReactNode {
    return <div className={styles.description}>{this.props.children}</div>
  }
}

export class Code extends Component<{},{}> {
  public render(): ReactNode {
    return <Highlight className={"JavaScript"}>{this.props.children}</Highlight>
  }
}
