import React, { useEffect } from "react";
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
  const CopiedComponent = ()  => {
    useEffect(() => {
      // component will hide after 5 seconds
      const timer = setTimeout(() => copyHandler(false), 5000);
      return () => clearTimeout(timer);
    }, []);
    return (
      <div className = "copiedTextLink">
        <span>Copied Component!</span>
        <br/>
      </div>
    );
  }
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
                {copiedFullName && <CopiedComponent/>}
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
