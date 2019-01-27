import * as React from 'react';
import {Component, ReactNode} from "react";
import styles from "./styles.module.css";
import {DomainService} from "../../services/DomainService";
import {DomainDescriptor} from "../../models/DomainDescriptor";
import {Card, Col, Icon} from "antd";
import {injectAs} from "../../utils/mobx-utils";
import {DomainCard} from "../DomainCard";

export interface RecentDomainInjectedProps {
  domainService: DomainService
}

export interface RecentDomainState {
  domains: DomainDescriptor[] | null;
}

export class RecentDomainsComponent extends Component<RecentDomainInjectedProps, RecentDomainState> {


  constructor(props: RecentDomainInjectedProps) {
    super(props);

    this.state = {
      domains: null
    };

    this.props.domainService.getDomains().then(domains => {
      this.setState({domains});
    });
  }

  render(): ReactNode {
    return (
      <Card title={<span><Icon type="database"/> Favorite Domains</span>}>
        {

          (this.state.domains || []).map((d: DomainDescriptor) => (
            <Col span={8} key={`${d.namespace}/${d.id}`}>
              <DomainCard domain={d}/>
            </Col>
          ))
        }
      </Card>
    );
  }
}

export const RecentDomains = injectAs<{}>(["domainService"], RecentDomainsComponent);
