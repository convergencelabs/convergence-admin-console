import React, {ReactElement} from "react";
import {ObjectNodeRenderer, ObjectNodeRendererProps} from "./ObjectNodeRenderer";
import {BooleanNodeRenderer, BooleanNodeRendererProps} from "./BooleanNodeRenderer";
import {StringNodeRenderer, StringNodeRendererProps} from "./StringNodeRenderer";
import {NumberNodeRenderer, NumberNodeRendererProps} from "./NumberNodeRenderer";
import {NullNodeRenderer, NullNodeRendererProps} from "./NullNodeRenderer";
import {ArrayNodeRenderer, ArrayNodeRendererProps} from "./ArrayNodeRenderer";
import {DateNodeRenderer, DateNodeRendererProps} from "./DateNodeRenderer";
import {TreeNode} from "../../model/TreeNode";
import {ObjectNode} from "../../model/ObjectNode";
import {ArrayNode} from "../../model/ArrayNode";
import {StringNode} from "../../model/StringNode";
import {NumberNode} from "../../model/NumberNode";
import {BooleanNode} from "../../model/BooleanNode";
import {DateNode} from "../../model/DateNode";
import {NullNode} from "../../model/NullNode";

export function createNodeRenderer(label: string,
                                   node: TreeNode<any>,
                                   editableLabel: boolean,
                                   labelPattern: RegExp): ReactElement<any> {
  if (node instanceof ObjectNode) {
    const props: ObjectNodeRendererProps = {
      editableLabel: editableLabel,
      label: label,
      labelPattern: labelPattern,
      node: node
    };
    return <ObjectNodeRenderer key={node.id()} {...props} />;
  } else if (node instanceof ArrayNode) {
    const props: ArrayNodeRendererProps = {
      editableLabel: editableLabel,
      label: label,
      labelPattern: labelPattern,
      node: node
    };
    return <ArrayNodeRenderer key={node.id()} {...props} />;
  } else if (node instanceof StringNode) {
    const props: StringNodeRendererProps = {
      editableLabel: editableLabel,
      label: label,
      labelPattern: labelPattern,
      node: node
    };
    return <StringNodeRenderer key={node.id()} {...props} />;
  } else if (node instanceof NumberNode) {
    const props: NumberNodeRendererProps = {
      editableLabel: editableLabel,
      label: label,
      labelPattern: labelPattern,
      node: node,
    };
    return <NumberNodeRenderer key={node.id()} {...props} />;
  } else if (node instanceof BooleanNode) {
    const props: BooleanNodeRendererProps = {
      editableLabel: editableLabel,
      label: label,
      labelPattern: labelPattern,
      node: node
    };
    return <BooleanNodeRenderer key={node.id()} {...props} />;
  } else if (node instanceof DateNode) {
    const props: DateNodeRendererProps = {
      editableLabel: editableLabel,
      label: label,
      labelPattern: labelPattern,
      node: node
    };
    return <DateNodeRenderer key={node.id()} {...props} />;
  } else if (node instanceof NullNode) {
    const props: NullNodeRendererProps = {
      editableLabel: editableLabel,
      label: label,
      labelPattern: labelPattern,
      node: node
    };
    return <NullNodeRenderer key={node.id()} {...props} />;
  } else {
    throw new Error("Unknown data type");
  }
}