/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

export const SERVICES = {
  SERVER_STATUS_SERVICE: "serverStatusService",
  CONFIG_SERVICE: "configService",
  AUTH_SERVICE: "authService",
  LOGGED_IN_USER_SERVICE: "loggedInUserService",
  NAMESPACE_SERVICE: "namespaceService",
  USER_SERVICE: "userService",
  ROLE_SERVICE: "roleService",
  DOMAIN_SERVICE: "domainService",
  API_KEY_SERVICE: "apiKeyService",
  LOCAL_STORAGE_SERVICE: "localStorageService",

  DOMAIN_COLLECTION_SERVICE: "domainCollectionService",
  DOMAIN_MODEL_SERVICE: "domainModelService",
  DOMAIN_USER_SERVICE: "domainUserService",
  DOMAIN_GROUP_SERVICE: "domainGroupService",
  DOMAIN_JWT_KEY_SERVICE: "domainJwtKeyService",
  DOMAIN_CONFIG_SERVICE: "domainConfigService",
  DOMAIN_MEMBER_SERVICE: "domainMemberService",
  DOMAIN_SESSION_SERVICE: "domainSessionService",
  DOMAIN_CHAT_SERVICE: "domainChatService",
}

Object.freeze(SERVICES);