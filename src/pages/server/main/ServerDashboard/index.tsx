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
import {Page} from "../../../../components";
import {Col, Row} from "antd";
import styles from "./styles.module.css";
import {SpacedGrid} from "../../../../components/common/SpacedGrid/";
import {FavoriteDomains} from "../../../../components/server/FavoriteDomains/";
import {ServerAlerts} from "../../../../components/server/ServerAlerts/";
import {ServerInfo} from "../../../../components/server/ServerInfo";

export class ServerDashboard extends React.Component<{}, {}> {

  public render(): ReactNode {
    return (
      <Page breadcrumbs={[]}>
        <SpacedGrid>
          <Row gutter={16}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12} className={styles.col}>
              <ServerInfo/>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <ServerAlerts/>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <FavoriteDomains/>
            </Col>
          </Row>
        </SpacedGrid>
      </Page>
    );
  }
}
