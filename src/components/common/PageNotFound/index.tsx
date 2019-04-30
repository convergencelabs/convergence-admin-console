import React, {ReactNode} from "react";
import {Icon} from "antd";
import styles from "./styles.module.css";
import {MessagePage} from "../MessagePage";

export interface PageNotFoundProps {
  text?: string;
}

export class PageNotFound extends React.Component<PageNotFoundProps, {}> {
  public render(): ReactNode {
    return (
      <MessagePage>
          <Icon type="frown" className={styles.icon}/>
          <div className={styles.title}>Page Not Found</div>
          <div className={styles.text}>{this.props.text || "Unfortunately no page exists at this url."}</div>
      </MessagePage>
    );
  }
}