/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import {AdminConsole} from './AdminConsole';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<AdminConsole />, div);
  ReactDOM.unmountComponentAtNode(div);
});
