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

export const SERVICES = {
  SERVER_STATUS_SERVICE: "serverStatusService",
  CONFIG_SERVICE: "configService",
  AUTH_SERVICE: "authService",
  LOGGED_IN_USER_SERVICE: "loggedInUserService",
  NAMESPACE_SERVICE: "namespaceService",
  USER_SERVICE: "userService",
  ROLE_SERVICE: "roleService",
  DOMAIN_SERVICE: "domainService",
  SCHEMA_SERVICE: "schemaService",
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
  DOMAIN_ACTIVITY_SERVICE: "domainActivityService"
}

Object.freeze(SERVICES);