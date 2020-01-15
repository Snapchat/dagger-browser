import React from "react";
import { Weight } from "../models/Graph";
import NodeWeight from "./NodeWeight";

type Props = {
    subcomponentName: string;
    weight: Weight;
    onSelect?: (node: string) => void;
};


function getDisplayName(key: string): string {
    let index = key.lastIndexOf(".");
    return key.substring(index + 1)
  }

const SubcomponentLink: React.FC<Props> = ({
  subcomponentName,
  weight,
  onSelect
}: Props) => {
  return (<div>
    <div className="binding" onClick={() => onSelect && onSelect(subcomponentName)}>
      <div className="text">
        {getDisplayName(subcomponentName)}
      </div>
      <div>
        <NodeWeight weight={weight} />
      </div>
    </div>
  </div>);

};

export default SubcomponentLink;
