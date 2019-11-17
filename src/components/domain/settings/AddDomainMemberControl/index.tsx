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

import React, {ReactNode} from 'react';
import {Button, Select} from "antd";
import {DomainId} from "../../../../models/DomainId";
import {DomainMember} from "../../../../models/domain/DomainMember";
import {UsernameAutoComplete} from "../../../server/UsernameAutoComplete";
import styles from "./styles.module.css";

interface AddDomainMemberControlProps {
  domainId: DomainId;
  onAdd(member: DomainMember): Promise<boolean>;
}

interface AddDomainMemberControlState {
  username: string;
  role: string;
}

export class AddDomainMemberControl extends React.Component<AddDomainMemberControlProps, AddDomainMemberControlState> {

  private readonly _defaultRole = "Developer";

  constructor(props: AddDomainMemberControlProps) {
    super(props);

    this.state = {
      username: "",
      role: this._defaultRole
    }
  }

  public render(): ReactNode {
    const disabled = this.state.username === "";
    return (
      <div className={styles.addControl}>
        <UsernameAutoComplete
          className={styles.username}
          value={this.state.username}
          onChange={this._onUsernameChanged}
          placeholder="Select User"
        />
        <Select className={styles.role} value={this.state.role} onChange={this._onRoleChanged}>
          <Select.Option value="Developer">Developer</Select.Option>
          <Select.Option value="Domain Admin">Domain Admin</Select.Option>
          <Select.Option value="Owner">Owner</Select.Option>
        </Select>
        <Button
          htmlType="button"
          type="primary"
          onClick={this._onAdd}
          disabled={disabled}
        >Add</Button>
      </div>
    );
  }

  private _onUsernameChanged = (username: string) => {
    this.setState({username});
  }

  private _onRoleChanged = (role: string) => {
    this.setState({role});
  }

  private _onAdd = () => {
    this.props
      .onAdd(new DomainMember(this.state.username, this.state.role))
      .then(() => {
        this.setState({
          username: "",
          role: this._defaultRole
        })
      });
  }
}
