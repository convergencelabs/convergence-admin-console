import * as React from 'react';
import {ReactNode} from 'react';
import styles from './styles.module.css';
import {DomainDescriptor} from "../../../models/DomainDescriptor";
import {Button, Card, Input, Tooltip} from "antd";
import {SERVICES} from "../../../services/ServiceConstants";
import {ConfigService} from "../../../services/ConfigService";
import {injectObserver} from "../../../utils/mobx-utils";
import {domainRealtimeUrl, toDomainRoute} from "../../../utils/domain-url";
import {CopyAddOnButton} from "../../common/CopyAddonButton/";
import {DomainStatusIcon} from "../../common/DomainStatusIcon";
import {formatDomainStatus} from "../../../utils/format-utils";
import {DomainStatus} from "../../../models/DomainStatus";
import {DisableableLink} from "../../common/DisableableLink"
import classNames from "classnames";
import {STORES} from "../../../stores/StoreConstants";
import {ConfigStore} from "../../../stores/ConfigStore";
import {DomainId} from "../../../models/DomainId";

export interface DomainCardProps {
  domain: DomainDescriptor
}

interface Injected {
  configService: ConfigService;
  configStore: ConfigStore;
}

export class DomainCardComponent extends React.Component<DomainCardProps & Injected, {}> {
  public render(): ReactNode {
    const domain = this.props.domain;
    const url = domainRealtimeUrl(domain.namespace, domain.id);
    const disabled = domain.status === DomainStatus.INITIALIZING || domain.status === DomainStatus.DELETING;
    const cls: string[] = [];
    cls.push(styles.domainCard);
    if (disabled) {
      cls.push(styles.domainCardDisabled);
    }

    const className = classNames(...cls);
    const linkUrl = toDomainRoute(new DomainId(domain.namespace, domain.id), "");
    return (
      <Card className={className} hoverable={true}>
        <DisableableLink to={{pathname: linkUrl}} disabled={disabled} >
          <span className={styles.title}>{domain.displayName}</span>
        </DisableableLink>
        <span className={styles.status}>
          <Tooltip title={formatDomainStatus(domain.status)}>
            <span><DomainStatusIcon status={domain.status}/></span>
          </Tooltip>
        </span>
        <div className={styles.nsid}>{this.props.configStore.namespacesEnabled ? domain.namespace + " / " : ""}{domain.id}</div>
        <Input
          className={styles.url}
          value={url}
          addonAfter={<CopyAddOnButton copyText={url}/>}
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

function DomainCardButton(props: {
  domain: DomainDescriptor,
  icon: string,
  link: string,
  tooltip: string,
  disabled: boolean}) {
  const {domain, link, tooltip, icon, disabled} = props;
  const url = toDomainRoute(new DomainId(domain.namespace, domain.id), link)
  return (
    <Tooltip title={tooltip} mouseEnterDelay={1}>
      <DisableableLink to={url} disabled={disabled}>
        <Button shape="circle" icon={icon} disabled={disabled}/>
      </DisableableLink>
    </Tooltip>
  )
}


const injections = [SERVICES.CONFIG_SERVICE, STORES.CONFIG_STORE];
export const DomainCard = injectObserver<DomainCardProps>(injections, DomainCardComponent);
