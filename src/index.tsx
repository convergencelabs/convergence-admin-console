/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import {AdminConsole} from './AdminConsole';
import {Provider} from "mobx-react";
import {authStore} from "./stores/AuthStore";
import {domainStore} from "./stores/DomainStore";
import {localStorageService} from "./services/LocalStorageService";
import {domainService} from "./services/DomainService";
import {apiKeyService} from "./services/ApiKeyService";
import {configService} from "./services/ConfigService";
import {namespaceService} from "./services/NamespaceService";
import {userService} from "./services/UserService";
import {roleService} from "./services/RoleService";
import {authService} from "./services/AuthService";
import {serverStatusService} from "./services/ServerStatusService";
import {loggedInUserService} from "./services/LoggedInUserService";
import {profileStore} from "./stores/ProfileStore";
import {configStore} from "./stores/ConfigStore";
import {domainCollectionService} from "./services/domain/DomainCollectionService";
import {domainModelService} from "./services/domain/DomainModelService";
import {domainUserService} from "./services/domain/DomainUserService";
import {domainGroupService} from "./services/domain/DomainGroupService";
import {domainJwtKeyService} from "./services/domain/DomainJwtKeyService";
import {domainConfigService} from "./services/domain/DomainConfigService";
import {domainMemberService} from "./services/domain/DomainMemberService";
import {domainSessionService} from "./services/domain/DomainSessionService";
import {domainChatService} from "./services/domain/DomainChatService";
import {convergenceDomainStore} from "./stores/ConvergenceDomainStore";
import {breadcrumbsStore} from "./stores/BreacrumsStore";
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
  configStore,
  breadcrumbsStore,

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
  serverStatusService,
  apiKeyService,

  domainCollectionService,
  domainModelService,
  domainUserService,
  domainGroupService,
  domainJwtKeyService,
  domainConfigService,
  domainMemberService,
  domainSessionService,
  domainChatService
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
            bootstrap();
          })
      } else {
        bootstrap();
      }
    })
    .catch(err => {
      console.error(err);
      bootstrap();
    });
} else {
  bootstrap();
}

function bootstrap() {
  ReactDOM.render((
    <Provider {...stores} {...services}>
      <AdminConsole/>
    </Provider>
  ), document.getElementById('root'));
}
