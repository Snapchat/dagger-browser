import React from "react";
import classNames from "classnames";
import { Weight } from "../models/Graph";

type Props = {
  weight: Weight | null | undefined;
};

const NodeWeight = ({ weight }: Props) => {
  if (!weight) {
    return <span />;
  }

  return (
    <span>
      {weight && weight.value > 0 &&
        <span
          className={classNames("unselectable", "bubble", getWeightColor(weight))}
          title={weight.summary}
        >
          {weight.value} {weight.unit ? weight.unit : ''}
        </span>
      }
    </span>
  );
};

const getWeightColor = (weight: Weight): string => {
  if (weight.value > weight.largeThreshold) {
    return "red";
  } else if (weight.value > weight.smallThreshold) {
    return "orange";
  } else {
    return "green";
  }
};

export default NodeWeight;
