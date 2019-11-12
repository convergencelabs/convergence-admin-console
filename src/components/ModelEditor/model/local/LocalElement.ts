/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

import {ModelPathElement} from "../ModelPath";

export interface LocalElement {
   _setFieldInParent(relPath: ModelPathElement): void;
}