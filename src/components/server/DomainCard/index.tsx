import * as React from 'react';
import styles from './styles.module.css';
import {DomainDescriptor} from "../../../models/DomainDescriptor";
import {Button, Card, Icon, Input, Tooltip} from "antd";
import {Link} from "react-router-dom";
import {SERVICES} from "../../../services/ServiceConstants";
import {ConfigService} from "../../../services/ConfigService";
import {injectAs} from "../../../utils/mobx-utils";
import {domainUrl} from "../../../utils/domain-url";
import {CopyAddonButton} from "../../common/CopyAddonButton/index";
import {AppConfig} from "../../../stores/AppConfig";
import {DomainStatusIcon} from "../../common/DomainStatusIcon";
import {formatDomainStatus} from "../../../utils/format-utils";

export interface DomainCardProps {
  domain: DomainDescriptor
}

interface Injected {
  configService: ConfigService
}

export class DomainCardComponent extends React.Component<DomainCardProps & Injected, {}> {
  render() {
    const domain = this.props.domain;
    const url = domainUrl(domain.namespace, domain.id);
    return (
      <Card className={styles.domainCard} hoverable={true}>
        <Link to={{pathname: `/domain/${domain.namespace}/${domain.id}/`}}>
          <span className={styles.title}>{domain.displayName}</span>
        </Link>
        <span className={styles.status}>
          <Tooltip title={formatDomainStatus(domain.status)}>
            <span><DomainStatusIcon status={domain.status}/></span>
          </Tooltip>
        </span>
        <div className={styles.nsid}>{domain.namespace} / {domain.id}</div>
        <Input
          className={styles.url}
          value={url}
          addonAfter={<CopyAddonButton copyText={url}/>}
        />
        <div className={styles.buttons}>
          <CardButton link="" domain={domain} tooltip={"Domain Dashboard"} icon="dashboard"/>
          <CardButton link="users" domain={domain} tooltip={"Domain Users"} icon="user"/>
          <CardButton link="groups" domain={domain} tooltip={"Domain Groups"} icon="team"/>
          <CardButton link="sessions" domain={domain} tooltip={"Domain Sessions"} icon="cloud"/>
          <CardButton link="chat" domain={domain} tooltip={"Domain Chat"} icon="message"/>
          <CardButton link="collections" domain={domain} tooltip={"Domain Collections"} icon="folder"/>
          <CardButton link="models" domain={domain} tooltip={"Domain Models"} icon="file"/>
          <CardButton link="settings" domain={domain} tooltip={"Domain Settings"} icon="setting"/>
        </div>
      </Card>
    );
  }
}

function CardButton(props: { domain: DomainDescriptor, icon: string, link: string, tooltip: string }) {
  const {domain, link, tooltip, icon} = props;
  const url = `domain/${domain.namespace}/${domain.id}/${link}`
  return (
    <Tooltip title={tooltip} mouseEnterDelay={1}>
      <Link to={url}><Button shape="circle" icon={icon}/></Link>
    </Tooltip>
  )
}

export const DomainCard = injectAs<DomainCardProps>([SERVICES.CONFIG_SERVICE], DomainCardComponent);
