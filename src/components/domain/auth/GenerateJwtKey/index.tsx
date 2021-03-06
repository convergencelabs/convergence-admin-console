/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is part of the Convergence Server, which is released under
 * the terms of the GNU General Public License version 3 (GPLv3). A copy
 * of the GPLv3 should have been provided along with this file, typically
 * located in the "LICENSE" file, which is part of this source code package.
 * Alternatively, see <https://www.gnu.org/licenses/gpl-3.0.html> for the
 * full text of the GPLv3 license, if it was not provided.
 */

import React, {ReactNode} from "react";
import { CopyOutlined } from '@ant-design/icons';
import {Button, Input, Modal, Spin, Tabs} from "antd";
import {FormButtonBar} from "../../../common/FormButtonBar";
import {DomainJwtKeyService} from "../../../../services/domain/DomainJwtKeyService";
import {SERVICES} from "../../../../services/ServiceConstants";
import {injectAs} from "../../../../utils/mobx-utils";
import {DescriptionBox} from "../../../common/DescriptionBox";
import styles from "./styles.module.css";
import CopyToClipboard from "react-copy-to-clipboard";

export interface GenerateJwtKeyModalProps {
  onCancel: () => void;
  onUse: (publicKey: string) => void;
}

interface InjectedProps extends GenerateJwtKeyModalProps {
  domainJwtKeyService: DomainJwtKeyService;
}


interface GenerateJwtKeyModalState {
  loading: boolean;
  publicKey: string;
  privateKey: string;
}


class GenerateJwtKeyModal extends React.Component<InjectedProps, GenerateJwtKeyModalState> {
  constructor(props: InjectedProps) {
    super(props);

    this.state = {
      loading: true,
      publicKey: "",
      privateKey: ""
    };

    this._generateKey();
  }

  public render(): ReactNode {
      return (
        <Modal title="Generate Jwt Key" visible={true} footer={null} width={650}>
          <DescriptionBox>
            The public key will be imported into the key form and ultimately saved with the
            JWT Key. However, the private key will not be saved. You must copy / save the key
            and keep it safe.
          </DescriptionBox>
          <Spin spinning={this.state.loading}>
            <Tabs className={styles.tabs}>
              <Tabs.TabPane tab="Private Key" key="private">
                <Input.TextArea autoSize={{minRows: 6, maxRows: 10}}
                                readOnly={true}
                                value={this.state.privateKey}/>
                <CopyToClipboard text={this.state.privateKey}>
                  <Button htmlType="button" icon={<CopyOutlined />} className={styles.copyButton}>Copy Private Key</Button>
                </CopyToClipboard>
              </Tabs.TabPane>
              <Tabs.TabPane tab="Public Key" key="public">
                <Input.TextArea autoSize={{minRows: 6, maxRows: 10}}
                                readOnly={true}
                                value={this.state.publicKey}/>
              </Tabs.TabPane>
            </Tabs>
          </Spin>
          <FormButtonBar>
            <Button htmlType="button" onClick={this.props.onCancel}>Cancel</Button>
            <Button type="primary" htmlType="submit" onClick={this._onUse}>Use Key</Button>
          </FormButtonBar>
        </Modal>
      );
  }

  private _onUse = () => {
    this.props.onUse(this.state.publicKey);
  }

  private _generateKey = () => {
    this.props.domainJwtKeyService
      .generateKey()
      .then(({publicKey, privateKey}) => {
        this.setState({publicKey, privateKey, loading: false});
      })
  }
}

const injections = [SERVICES.DOMAIN_JWT_KEY_SERVICE];
export const GenerateJwtKey = injectAs<GenerateJwtKeyModalProps>(injections, GenerateJwtKeyModal);
