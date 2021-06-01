import React, {ReactElement} from "react";
import {Select} from "antd";
import {SelectProps} from "antd/lib/select";
const {Option} = Select;

export interface BooleanSelectProps extends SelectProps<string> {
  trueLabel: string;
  trueValue?: string;
  falseLabel: string;
  falseValue?: string;
}

export function BooleanSelect(props: BooleanSelectProps): ReactElement {
  const {trueLabel, falseLabel, trueValue, falseValue, ...selectProps} = props;
  const trueVal = trueValue === undefined ? "true" : trueValue;
  const falseVal = falseValue === undefined ? "false" : falseValue;
  return (
      <Select {...selectProps}>
        <Option value={trueVal}>{props.trueLabel}</Option>
        <Option value={falseVal}>{props.falseLabel}</Option>
      </Select>
  )
}