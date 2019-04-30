import React, {ReactNode} from "react";
import {Spin} from "antd";
import styles from "./styles.module.css";
import {MessagePage} from "../../../common/MessagePage";

export class DomainLoading extends React.Component<{}, {}> {
  public render(): ReactNode {
    return (
      <MessagePage>
        <Spin size={"large"}/>
        <div className={styles.text}>Loading Domain</div>
      </MessagePage>
    );
  }
}