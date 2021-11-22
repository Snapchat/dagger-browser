import React from "react";
import { Node, Weight } from "../models/Graph";
import CodeLink from "./CodeLink";
import NodeIcon from "./NodeIcon";
import NodeWeight from "./NodeWeight";
import DisplayNameHelper from "../util/DisplayNameHelper";
import "./NodeToolTip.css";
import LinkImg from "../util/link.png"
import Copy from "clipboard-copy"

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
  const displayNameHelper = new DisplayNameHelper()
  const [copiedFullName , copyHandler ]  = React.useState(false)
  return (<div className="tooltip_link">
    <div className="binding">
      <div>
        <NodeIcon kind={kind || node.kind} />
        {scoped && <span className="light-text">{scope}&nbsp;</span>}
        <span onClick={() => onSelect && onSelect(node.key)} >{displayNameHelper.displayNameForKey(getDisplayName(node.key))}</span>
              <span className="tooltiptext_link" onClick={() => Copy(node.key)}>
                <img src = {LinkImg} height = {12} width = {12} onMouseLeave = {() => copyHandler(false)} 
                onClick = {() => {copyHandler(true)
                }}/> 
                &nbsp;{copiedFullName && <span className = "copied_span">Copied!</span>}
                &nbsp; {node.key}
              </span>
      </div>
      <div>
        <CodeLink link={node.key} />
        <NodeWeight weight={weight} />
      </div>
    </div>
  </div>);

};

export default NodeLink;
