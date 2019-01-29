import * as React from 'react';
import styles from './styles.module.css';
import {DomainDescriptor} from "../../models/DomainDescriptor";
import {Button, Card, Icon, Input} from "antd";
import {Link} from "react-router-dom";
import {SERVICES} from "../../services/ServiceConstants";
import {ConfigService} from "../../services/ConfigService";
import {injectAs} from "../../utils/mobx-utils";
import {domainUrl} from "../../utils/domain-url";
import {CopyAddonButton} from "../CopyAddonButton";

export interface DomainCardProps {
  domain: DomainDescriptor
}

interface Injected {
  configService: ConfigService
}

export class DomainCardComponent extends React.Component<DomainCardProps & Injected, {}> {
  render() {
    const domain = this.props.domain;
    const baseUrl = this.props.configService.getServerRealtimeUrl();
    const url = domainUrl(baseUrl, domain.namespace, domain.id);
    return (
      <Card className={styles.domainCard} hoverable={true}>
        <Link to={{pathname: `/domain/${domain.namespace}/${domain.id}/`}}>
          <span className={styles.title}>{domain.displayName}</span>
        </Link>
        <Icon type="check-circle" className={styles.status}/>
        <div className={styles.nsid}>{domain.namespace} / {domain.id}</div>
        <Input
          className={styles.url}
          value={url}
          addonAfter={<CopyAddonButton copyText={url}/>}
        />
      </Card>
    );
  }
}

export const DomainCard = injectAs<DomainCardProps>([SERVICES.CONFIG_SERVICE], DomainCardComponent);
