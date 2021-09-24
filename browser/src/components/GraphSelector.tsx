import Select from "react-select";
import React from "react";
import { ValueType, OptionTypeBase } from "react-select/src/types";

interface Props {
  componentName: string;
  graphs: String[];
  selectGraph: (componentName: string) => any;
}

function displayName(component: string): string {
  var pos = component.lastIndexOf('.')
  if (pos === -1) {
    return component
  }
  return component.substring(pos+1)
}

/**
 * Component Selector
 * If no component is specified `All Components` will be picked
 */
export const GraphSelector = ({
  componentName,
  graphs,
  selectGraph
}: Props) => {
  let graphOptions = graphs.map(graph => {
    return { value: graph, label: displayName(graph.toString()) };
  });

  let defaultValue = componentName
    ? ({ value: componentName, label: displayName(componentName) } as ValueType<OptionTypeBase, false>)
    : graphOptions[0];

  return (
    <Select
      value={defaultValue}
      className="component-select"
      classNamePrefix="react-select"
      onChange={value => selectGraph((value as unknown as { value: string }).value)}
      placeholder="Select graph..."
      options={graphOptions}
    />
  );
};
