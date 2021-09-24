import React from "react";
import Select from "react-select";
import WeightServiceManager from "../service/WeightServiceManager";

interface Props {
  weightServiceManager: WeightServiceManager;
  onSelectWeight: (weight: string) => any;
}

/** Dropdown for selecting the metric for node weights. */
export default class WeightSelector extends React.Component<Props> {

  metricOptions: Array<{ label: string, value: string }>;

  constructor(props: Props) {
    super(props);
    this.metricOptions = this.props.weightServiceManager.getWeightServiceNames().map(name => {
      return { label: name.charAt(0).toUpperCase() + name.slice(1), value: name };
    });
    this.state = this.metricOptions[0];
  }

  render() {
    return (
      <Select
          className="component-select weight-select"
          classNamePrefix="react-select"
          value={this.metricOptions[0]}
          onChange={selectedOption => {
              const option = selectedOption as { value: string };
              this.setState(option);
              this.props.onSelectWeight(option.value);
            }
          }
          options={this.metricOptions}
      />
    );
  }
}