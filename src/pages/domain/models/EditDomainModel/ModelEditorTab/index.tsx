import React, {ReactNode} from 'react';
import {injectAs} from "../../../../../utils/mobx-utils";
import {SERVICES} from "../../../../../services/ServiceConstants";
import {DomainModelService} from "../../../../../services/domain/DomainModelService";
import {SapphireEditor} from "../../../../../components/ModelEditor/";
import {STORES} from "../../../../../stores/StoreConstants";
import {ConvergenceDomainStore} from "../../../../../stores/ConvergenceDomainStore";
import {RealTimeModel} from "@convergence/convergence";
import {Button, Popover} from "antd";
import styles from "./styles.module.css";
import {filter} from "rxjs/operators";
import {longDateTime} from "../../../../../utils/format-utils";
import confirm from "antd/lib/modal/confirm";

export interface ModelEditorTabProps {
  modelId: string;
}

interface InjectedProps extends ModelEditorTabProps {
  domainModelService: DomainModelService;
  convergenceDomainStore: ConvergenceDomainStore;
}

export interface ModelEditorTabState {
  model: RealTimeModel | null;
  connectedUsers: string[];
  version: number;
  lastModified: Date;
}

class ModelEditorTabComponent extends React.Component<InjectedProps, ModelEditorTabState> {
  constructor(props: InjectedProps) {
    super(props);

    this.state = {
      model: null,
      lastModified: new Date(),
      version: 0,
      connectedUsers: []
    }
  }

  public componentDidMount(): void {
    // TODO if we unmounted before we loaded, we need to close the model after it is opened.
    this.props.convergenceDomainStore.domain!
      .models()
      .open(this.props.modelId)
      .then(model => {
        const version = model.version();
        const lastModified = model.maxTime();
        const connectedUsers = this._buildConnectedUsers(model);
        this.setState({model, version, lastModified, connectedUsers});
        // FIXME unsubscribe
        model.root().events().subscribe(this._onVersionChanged);
        model
          .events()
          .pipe(filter(event =>
            event.name === RealTimeModel.Events.COLLABORATOR_CLOSED ||
            event.name === RealTimeModel.Events.COLLABORATOR_OPENED
          ))
          .subscribe(this._onUsersChangeed);
        model.emitLocalEvents(true);
      });
  }

  public componentWillUnmount(): void {
    if (this.state.model !== null) {
      if (this.state.model.isOpen()) {
        this.state.model.close().catch(err => console.error(err));
      }
    }
  }

  public render(): ReactNode {
    if (this.state.model !== null) {
      return (
        <div className={styles.editorWrapper}>
          <div className={styles.metaToolbar}>
            <span className={styles.label}>Version:</span>
            <span className={styles.value}>{this.state.version}</span>
            <span className={styles.label}>Last Modified:</span>
            <span className={styles.value}>{longDateTime(this.state.lastModified)}</span>
            <span className={styles.label}>Created:</span>
            <span className={styles.value}>{longDateTime(this.state.model.minTime())}</span>
            <span className={styles.spacer}/>
            {this._renderConnectedUsers()}
          </div>
          <SapphireEditor
            confirmDelete={this._confirmDelete}
            data={this.state.model.root()}
            defaultMode="view"
            rootLabel="$"
          />
        </div>
      );
    } else {
      return null;
    }
  }

  private _renderConnectedUsers(): ReactNode {
    const content =
      this.state.connectedUsers.map(user => (<div key={user}>{user}</div>))

    return (
      <Popover placement="bottomRight" title="Connected Users" content={content} trigger="click">
        <Button icon="team" size="small">{this.state.connectedUsers.length}</Button>
      </Popover>
    )
  }

  private _onUsersChangeed = () => {
    const connectedUsers = this._buildConnectedUsers(this.state.model!);
    this.setState({connectedUsers});
  }

  private _buildConnectedUsers(model: RealTimeModel): string[] {
    const collaborators: string[] = model.collaborators().map(collaborator => {
      return collaborator.user.convergence ?
        `${collaborator.user.displayName || collaborator.user.username} (Convergence User)` :
        collaborator.user.displayName || collaborator.user.username;
    }).filter(x => x !== undefined);

    return Array.from(new Set(collaborators));
  }

  private _onVersionChanged = () => {
    const model = this.state.model!;
    const version = model.version();
    const lastModified = model.maxTime();

    this.setState({version, lastModified});
  }

  private _confirmDelete = () => {
    return new Promise<boolean>(function(resolve, reject) {
      confirm({
        title: 'Delete Element?',
        content: 'Are you sure you want to delete this element?',
        okType: 'danger',
        onOk() {
          resolve(true);
        },
        onCancel() {
          resolve(false);
        },
      });
    });
  }
}

const injections = [SERVICES.DOMAIN_MODEL_SERVICE, STORES.CONVERGENCE_DOMAIN_STORE];
export const ModelEditorTab = injectAs<ModelEditorTabProps>(injections, ModelEditorTabComponent);
