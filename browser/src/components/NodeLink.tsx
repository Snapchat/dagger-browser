import React from "react";
import { Node, Weight } from "../models/Graph";
import CodeLink from "./CodeLink";
import NodeIcon from "./NodeIcon";
import NodeWeight from "./NodeWeight";

type Props = {
  node: Node;
  weight?: Weight;
  onSelect?: (node: string) => void;
  scoped?: boolean;
  kind?: string;
};

function getDisplayName(key: string): string {
  return key
    .replace("java.util.", "")
    .replace("java.lang.", "")
    .replace("javax.inject.", "")
    .replace("io.reactivex.", "")    
}

const NodeLink: React.FC<Props> = ({
  node,
  onSelect,
  weight = undefined,
  scoped = false,
  kind
}: Props) => {
  const scope = node.scope ? `[${node.scope.split(".").pop()}]` : "";
  return (<div>
    <div
      className="binding"
      onClick={() => onSelect && onSelect(node.key)}
    >
      <div className="text">
        <NodeIcon kind={kind || node.kind} />
        {scoped && <span className="light-text">{scope}&nbsp;</span>}
        {getDisplayName(node.key)}&nbsp;
      </div>
      <div>
        <CodeLink link={node.key} />
        <NodeWeight weight={weight} />
      </div>
    </div>
  </div>);

};

export default NodeLink;
