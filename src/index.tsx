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
import {roleService} from "./services/RoleService";
import {authService} from "./services/AuthService";
import {loggedInUserService} from "./services/LoggedInUserService";
import {profileStore} from "./stores/ProfileStore";
import {domainCollectionService} from "./services/domain/DomainCollectionService";
import {domainModelService} from "./services/domain/DomainModelService";
import {domainUserService} from "./services/domain/DomainUserService";
import {domainGroupService} from "./services/domain/DomainGroupService";
import {domainJwtKeyService} from "./services/domain/DomainJwtKeyService";
import {convergenceDomainStore} from "./stores/ConvergenceDomainStore";

import {message, notification} from "antd";
import {configure} from "mobx"

import './index.css';

configure({enforceActions: "always"});

message.config({
  top: 55,
  duration: 2,
  maxCount: 3,
});

notification.config({
  placement: 'bottomRight',
  duration: 3,
});

const stores = {
  authStore,
  profileStore,
  domainStore,

  convergenceDomainStore
};

const services = {
  authService,
  loggedInUserService,
  domainService,
  configService,
  namespaceService,
  userService,
  roleService,

  domainCollectionService,
  domainModelService,
  domainUserService,
  domainGroupService,
  domainJwtKeyService
};

const authToken = localStorageService.getAuthToken();
if (authToken) {
  authService.validateToken(authToken.token)
    .then(resp => {
      if (resp.valid) {
        authStore.setAuthenticated(authToken.token);
        loggedInUserService.getProfile()
          .then((profile) => {
            profileStore.setProfile(profile);
            boostrap();
          })
      } else {
        boostrap();
      }
    });
} else {
  boostrap();
}

function boostrap() {
  ReactDOM.render((
    <Provider {...stores} {...services}>
      <AdminConsole/>
    </Provider>
  ), document.getElementById('root'));
}
