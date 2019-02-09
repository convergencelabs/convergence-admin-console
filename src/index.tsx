import React from 'react';
import ReactDOM from 'react-dom';
import {AdminConsole} from './AdminConsole';
import {Provider} from "mobx-react";
import {authStore} from "./stores/AuthStore";
import {domainStore} from "./stores/DomainStore";
import {localStorageService} from "./services/LocalStorageService";
import {domainService} from "./services/DomainService";
import {configService} from "./services/ConfigService";
import {namespaceService} from "./services/NamespaceService";
import {userService} from "./services/UserService";

import {message} from "antd";
import {configure} from "mobx"

import './index.css';

configure({enforceActions: "always"});

message.config({
  top: 55,
  duration: 2,
  maxCount: 3,
});

const stores = {
  authStore,
  domainStore
};

const services = {
  domainService,
  configService,
  namespaceService,
  userService
};

const authToken = localStorageService.getAuthToken();
if (authToken) {
  authStore.setAuthenticated(authToken.token);
}

ReactDOM.render((
  <Provider { ...stores } {...services}>
    <AdminConsole />
  </Provider>
), document.getElementById('root'));
