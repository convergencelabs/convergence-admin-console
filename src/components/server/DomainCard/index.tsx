import * as React from 'react';
import {ReactNode} from 'react';
import styles from './styles.module.css';
import {DomainDescriptor} from "../../../models/DomainDescriptor";
import {Button, Card, Input, Tooltip} from "antd";
import {SERVICES} from "../../../services/ServiceConstants";
import {ConfigService} from "../../../services/ConfigService";
import {injectAs} from "../../../utils/mobx-utils";
import {domainUrl} from "../../../utils/domain-url";
import {CopyAddonButton} from "../../common/CopyAddonButton/";
import {DomainStatusIcon} from "../../common/DomainStatusIcon";
import {formatDomainStatus} from "../../../utils/format-utils";
import {DomainStatus} from "../../../models/DomainStatus";
import {DisableableLink} from "../../common/DisableableLink"
import classNames from "classnames";

export interface DomainCardProps {
  domain: DomainDescriptor
}

interface Injected {
  configService: ConfigService
}

export class DomainCardComponent extends React.Component<DomainCardProps & Injected, {}> {
  public render(): ReactNode {
    const domain = this.props.domain;
    const url = domainUrl(domain.namespace, domain.id);
    const disabled = domain.status === DomainStatus.INITIALIZING || domain.status === DomainStatus.DELETING;
    const cls: string[] = [];
    cls.push(styles.domainCard);
    if (disabled) {
      cls.push(styles.domainCardDisabled);
    }

    const className = classNames(...cls);
    return (
      <Card className={className} hoverable={true}>
        <DisableableLink to={{pathname: `/domain/${domain.namespace}/${domain.id}/`}} disabled={disabled} >
          <span className={styles.title}>{domain.displayName}</span>
        </DisableableLink>
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
          <DomainCardButton link="" domain={domain} tooltip={"Domain Dashboard"} icon="dashboard" disabled={disabled}/>
          <DomainCardButton link="users" domain={domain} tooltip={"Domain Users"} icon="user" disabled={disabled}/>
          <DomainCardButton link="groups" domain={domain} tooltip={"Domain Groups"} icon="team" disabled={disabled}/>
          <DomainCardButton link="sessions" domain={domain} tooltip={"Domain Sessions"} icon="cloud" disabled={disabled}/>
          <DomainCardButton link="chat" domain={domain} tooltip={"Domain Chat"} icon="message" disabled={disabled}/>
          <DomainCardButton link="collections" domain={domain} tooltip={"Domain Collections"} icon="folder" disabled={disabled}/>
          <DomainCardButton link="models" domain={domain} tooltip={"Domain Models"} icon="file" disabled={disabled}/>
          <DomainCardButton link="settings" domain={domain} tooltip={"Domain Settings"} icon="setting" disabled={disabled}/>
        </div>
      </Card>
    );
  }
}

function DomainCardButton(props: { domain: DomainDescriptor, icon: string, link: string, tooltip: string, disabled: boolean}) {
  const {domain, link, tooltip, icon, disabled} = props;
  const url = `domain/${domain.namespace}/${domain.id}/${link}`;
  return (
    <Tooltip title={tooltip} mouseEnterDelay={1}>
      <DisableableLink to={url} disabled={disabled}>
        <Button shape="circle" icon={icon} disabled={disabled}/>
      </DisableableLink>
    </Tooltip>
  )
}



export const DomainCard = injectAs<DomainCardProps>([SERVICES.CONFIG_SERVICE], DomainCardComponent);
