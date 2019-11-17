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

import {ArrayElement} from "../../../model/ArrayElement";
import {DateElement} from "../../../model/DateElement";
import {ObjectElement} from "../../../model/ObjectElement";
import {StringElement} from "../../../model/StringElement";
import {NumberElement} from "../../../model/NumberElement";
import {NullElement} from "../../../model/NullElement";
import {BooleanElement} from "../../../model/BooleanElement";
import {ModelElement} from "../../../model/ModelElement";
import {TreeNode} from "./TreeNode";
import {ArrayNode} from "./ArrayNode";
import {TreeModel} from "./TreeModel";
import {ObjectNode} from "./ObjectNode";
import {StringNode} from "./StringNode";
import {NumberNode} from "./NumberNode";
import {NullNode} from "./NullNode";
import {BooleanNode} from "./BooleanNode";
import {DateNode} from "./DateNode";
import {ContainerNode} from "./ContainerNode";

export function createTreeNode(tree: TreeModel,
                               parent: ContainerNode<any> | null,
                               data: ModelElement<any>): TreeNode<any> {
  if (data instanceof ArrayElement) {
    return new ArrayNode(tree, parent, data, false, false);
  } else if (data instanceof ObjectElement) {
    return new ObjectNode(tree, parent, data, false, false);
  } else if (data instanceof StringElement) {
    return new StringNode(tree, parent, data, false);
  } else if (data instanceof NumberElement) {
    return new NumberNode(tree, parent, data, false);
  } else if (data instanceof NullElement) {
    return new NullNode(tree, parent, data, false);
  } else if (data instanceof BooleanElement) {
    return new BooleanNode(tree, parent, data, false);
  } else if (data instanceof DateElement) {
    return new DateNode(tree, parent, data, false);
  } else {
    throw new Error("Unknown data type");
  }
}
