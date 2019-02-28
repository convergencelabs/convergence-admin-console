import React, {ReactNode} from "react";
import {Spin} from "antd";
import styles from "./styles.module.css";
import {MessagePage} from "../../../common/MessagePage";

export class DomainInitializing extends React.Component<{}, {}> {
  public render(): ReactNode {
    return (
      <MessagePage>
        <Spin size={"large"}/>
        <div className={styles.text}>This domain is initializing, please wait...</div>
      </MessagePage>
    );
  }
}