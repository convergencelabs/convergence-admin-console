import React, {ReactNode} from "react";
import {Icon} from "antd";
import {MessagePage} from "../MessagePage";
import styles from "./styles.module.css";

export interface ErrorPageProps {
  title: string;
  message: string;
}

export class ErrorPage extends React.Component<ErrorPageProps, {}> {
  public render(): ReactNode {
    return (
      <MessagePage>
          <Icon type="frown" className={styles.icon}/>
          <div className={styles.title}>{this.props.title}</div>
          <div className={styles.text}>{this.props.message}</div>
      </MessagePage>
    );
  }
}
