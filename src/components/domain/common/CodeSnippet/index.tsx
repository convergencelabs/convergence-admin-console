import React, {ReactNode} from "react";
import Highlight from "react-highlight";
import styles from "./styles.module.css";
import CopyToClipboard from "react-copy-to-clipboard";
import {Button} from "antd";

export interface CodeSnippetProps {
  description: string | ReactNode;
  code: string;
}

export class CodeSnippet extends React.Component<CodeSnippetProps, {}> {
  public render(): ReactNode {
    return (
      <div className={styles.codeSnippet}>
        <div className={styles.description}>{this.props.description}</div>
        <div className={styles.code}>
          <span className={styles.copy}>
            <CopyToClipboard text={this.props.code}>
              <Button htmlType="button" icon="copy"/>
            </CopyToClipboard>
          </span>
          <Highlight className={"JavaScript"}>{this.props.code}</Highlight>
        </div>
      </div>
    )
  }
}
