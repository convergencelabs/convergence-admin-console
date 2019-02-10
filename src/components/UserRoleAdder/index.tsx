import * as React from 'react';
import {Component, ReactNode} from "react";
import styles from "./styles.module.css";
import {UsernameAutoComplete} from "../UsernameAutoComplete";
import {Button, Select} from "antd";
import {UserRole} from "../UserRoleTable";
import {MouseEvent} from "react";
const {Option} = Select;

export interface UserRoleAdderProps {
  roles: string[];
  defaultRole: string;
  selectWidth: number;
  onAdd: (userRole: UserRole) => void;
}

export interface UserRoleAdderState {
  selectedUsername: string;
  selectedRole: string;
}

export class UserRoleAdder extends Component<UserRoleAdderProps,UserRoleAdderState> {

  constructor(props: UserRoleAdderProps) {
    super(props);

    this.state = {
      selectedUsername: "",
      selectedRole: this.props.defaultRole || ""
    };
  }


  public render(): ReactNode {
    return (
      <div className={styles.userRoleAdder}>
        <UsernameAutoComplete
          onChange={this._onChangeUsername}
          className={styles.username}
          value={this.state.selectedUsername}
          placeholder={"Select User to Add"}/>
        <Select
          style={{ width: this.props.selectWidth }}
          value={this.state.selectedRole}
          onSelect={this._onSelectRole}
        >
          {this.props.roles.map(role => <Option key={role}>{role}</Option>)}
        </Select>
        <Button
          htmlType="button"
          type="primary"
          disabled={this.state.selectedUsername === ""}
          onClick={this._onAdd}>Add</Button>
      </div>
    )
  }


  private _onSelectRole = (role: string) => {
    this.setState({selectedRole: role});
  }

  private _onChangeUsername = (username: string) => {
    this.setState({selectedUsername: username});
  }

  private _onAdd = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({selectedUsername: "", selectedRole: this.props.defaultRole});

    this.props.onAdd({username: this.state.selectedUsername, role: this.state.selectedRole})
  }
}
