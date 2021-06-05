/*
 * Copyright (c) 2021 - Convergence Labs, Inc.
 *
 * This file is part of the Convergence Server, which is released under
 * the terms of the GNU General Public License version 3 (GPLv3). A copy
 * of the GPLv3 should have been provided along with this file, typically
 * located in the "LICENSE" file, which is part of this source code package.
 * Alternatively, see <https://www.gnu.org/licenses/gpl-3.0.html> for the
 * full text of the GPLv3 license, if it was not provided.
 */

import React, {ChangeEvent, Component, ReactNode} from "react";
import {DomainService} from "../../../../services/DomainService";
import {Button, Collapse, Form, Input, notification} from "antd";
import {DescriptionBox} from "../../../../components/common/DescriptionBox";
import FormItem from "antd/es/form/FormItem";
import {FormButtonBar} from "../../../../components/common/FormButtonBar";
import {SERVICES} from "../../../../services/ServiceConstants";
import {injectAs} from "../../../../utils/mobx-utils";
import {STORES} from "../../../../stores/StoreConstants";
import {ActiveDomainStore} from "../../../../stores/ActiveDomainStore";
import styles from "./styles.module.css";
import * as H from "history";

export interface DeleteDomainProps {
  history: H.History;
}

export interface InjectedProps extends DeleteDomainProps {
  domainService: DomainService;
  activeDomainStore: ActiveDomainStore;
}

export interface DeleteDomainState {
  domainId: string;
}

class DeleteDomainComponent extends Component<InjectedProps, DeleteDomainState> {


  constructor(props: InjectedProps) {
    super(props);

    this.state = {
      domainId: ""
    }
  }

  public render(): ReactNode {
    const domainId = this.props.activeDomainStore.domainDescriptor!.domainId
    return (
        <Collapse defaultActiveKey={[]}>
          <Collapse.Panel header="Delete Domain" key="1">
            <DescriptionBox>
              <p>
                <span>
                  Proceed with caution. All users, settings, models, and other data within the
                  domain will be permanently destroyed. To delete the domain, type in domain id&nbsp;
                </span>
                <span className={styles.domainId}>{domainId.id}</span>
                <span>&nbsp;below and press the 'Delete' button.</span>
              </p>
              <span className={styles.warning}>Warning: Deleting a domain not be undone.</span>
            </DescriptionBox>
            <div>
              <Form layout="vertical">
                <FormItem id="id" label="Domain Id">
                  <Input value={this.state.domainId} onChange={this._onDomainIdChange}/>
                </FormItem>
                <FormButtonBar>
                  <Button
                      htmlType="button"
                      type="primary"
                      danger
                      disabled={domainId.id !== this.state.domainId}
                      onClick={this._onDelete}
                  >Delete</Button>
                </FormButtonBar>
              </Form>
            </div>
          </Collapse.Panel>
        </Collapse>
    );
  }

  private _onDomainIdChange = (e: ChangeEvent<HTMLInputElement>) => {
    const domainId = e.target.value;
    this.setState({domainId});
  }

  private _onDelete = () => {
    const domainId = this.props.activeDomainStore.domainDescriptor!.domainId;
    this.props.domainService
        .deleteDomain(domainId)
        .then(() => {
          notification.success({
            message: "Domain Deleted",
            description: `The domain '${domainId.namespace}/${domainId.id}' successfully deleted`
          });
          this.props.history.push("/");
        })
        .catch(err => {
          console.error(err);
          notification.error({
            message: "Domain Not Deleted",
            description: `The domain '${domainId.namespace}/${domainId.id}' could not be deleted`
          });
        });
  }
}

const injections = [SERVICES.DOMAIN_SERVICE, STORES.ACTIVE_DOMAIN_STORE];
export const DeleteDomain = injectAs<DeleteDomainProps>(injections, DeleteDomainComponent);
