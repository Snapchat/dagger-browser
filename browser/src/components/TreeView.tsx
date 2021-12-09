import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { Node } from "../models/Graph";
import GraphManager from "../models/GraphManager";
import Routes from "src/Routes";
import NodeLink from "./NodeLink";
import NodeIcon from "./NodeIcon";
import DisplayNameHelper from "../util/DisplayNameHelper";
import { CAccordion, CAccordionBody, CAccordionHeader, CAccordionItem } from '@coreui/react'
import '@coreui/coreui/dist/css/coreui.min.css'
import LinkImg from "../util/link.png"
import OpenLinkImg from "../util/openlink.png"
import Copy from "clipboard-copy"

type Props = {
  graphManager: GraphManager,
  componentName: string,
  nodeName: string;
};

type GraphOfNodes = {
  mapOfNodes : Map<string, string[]>
}

function FileSystemComponent (mapOfNodes:  Map<string, string[]>, nodeName: string, componentName: string, graphManager: GraphManager)  {
  const displayNameHelper = new DisplayNameHelper()
  const [copiedFullName , copyHandler ]  = useState(false)
  // only display copy component if it's copied
  const [nameOfComponentCopied , nameHandler ]  = useState("")
  const history = useHistory();
  const rootNode = graphManager.getNode(componentName, nodeName)
  const dependenciesIconMap: Map<string,string> = new Map()
  if(rootNode && rootNode.dependencies.length > 0) {
    rootNode.dependencies.map(node => {
      dependenciesIconMap.set(node.key, node.kind)
    })
  }
  const CopiedComponent = () => {
    useEffect(() => {
      // component will hide after 2 seconds
      const timer = setTimeout(() => copyHandler(false), 2000);
      return () => clearTimeout(timer);
    }, []);    
    return (
      <div className = "copiedTextAutosuggest">
        <span>Copied Component</span>
        <br/>
      </div>
    );
  }
  
  return (
    <div>
      {mapOfNodes.get(nodeName)?.map(node => {       
        let isInstance : string = ""
        if(dependenciesIconMap.get(node) && dependenciesIconMap.get(node) == "INSTANCE") {
          isInstance = "INSTANCE"
        }
          if (mapOfNodes.get(node)?.length != 0) { 
            return (
              <CAccordion activeItemKey = {"INSTANCE"}>
                <CAccordionItem itemKey = {isInstance}>
                  <div className="tooltip_tree" onMouseEnter = {() => nameHandler(node)}>
                      <CAccordionHeader>
                        <NodeIcon kind = {dependenciesIconMap.get(node)}/>
                        {displayNameHelper.displayNameForKey(node)}
                        <span className="tooltiptext_tree"  onClick={() => Copy(node)}>
                          <img src = {LinkImg} height = {12} width = {12} onClick={() => copyHandler(true)}/>
                          &nbsp;
                          <img src = {OpenLinkImg} height = {12} width = {12} onClick={() => 
                            history.push(Routes.GraphNode(componentName, node))}/> 
                          &nbsp;{node} 
                        </span>
                        {copiedFullName && node == nameOfComponentCopied && <CopiedComponent/>}
                      </CAccordionHeader>
                  </div>
                  <CAccordionBody>
                    {FileSystemComponent(mapOfNodes, node, componentName, graphManager)}
                  </CAccordionBody>
                </CAccordionItem>
              </CAccordion>
            )
          } else {
            return (
              <div className="tooltip_tree" onMouseEnter = {() => nameHandler(node)}>
              <CAccordionBody>
                  <NodeIcon kind = {dependenciesIconMap.get(node)}/>
                  {displayNameHelper.displayNameForKey(node)}
                  <span className="tooltiptext_tree" onClick={() => Copy(node)}>
                      <img src = {LinkImg} height = {12} width = {12} onClick={() => copyHandler(true)}/> 
                      &nbsp;
                      <img src = {OpenLinkImg} height = {12} width = {12} onClick={() => 
                        history.push(Routes.GraphNode(componentName, node))}/>
                      &nbsp;{node}
                  </span>
                  {copiedFullName && node == nameOfComponentCopied && <CopiedComponent/>}
              </CAccordionBody>
              </div>
            )
          }
        })
      }
    </div>
  )
}

export default function TreeView({ graphManager, componentName, nodeName }: Props) {

  const dependencies = getDependencies(graphManager, componentName, nodeName);
  const history = useHistory();
  const displayNameHelper = new DisplayNameHelper()
  const mapOfComponents = dependencies.mapOfNodes
  const [copiedFullName , copyHandler ]  = useState(false)
  const node = graphManager.getNode(componentName, nodeName)

  const CopiedComponent = () => {
    useEffect(() => {
      // component will hide after 2 seconds
      const timer = setTimeout(() => copyHandler(false), 2000);
      return () => clearTimeout(timer);
    }, []);
    return (
      <div className = "copiedTextAutosuggest">
        <span>Copied Component</span>
        <br/>
      </div>
    );
  }
  return (
    <div className="card">
      <div className="card-content">    
        <div className="card-title">
            Tree for: {displayNameHelper.displayNameForKey(nodeName)} 
        </div> 
        <div className="card-title">
            Component: {componentName.substr(componentName.lastIndexOf(".") + 1)} 
        </div> 
        <CAccordion activeItemKey={"INSTANCE"}>
          <CAccordionItem itemKey ={"INSTANCE"}>
          <div className="tooltip_tree">
            <CAccordionHeader>
              <NodeIcon kind={node?.kind} />
              {displayNameHelper.displayNameForKey(nodeName)}
                <span className="tooltiptext_tree" onClick={() => Copy(nodeName)}>
                  <img src = {LinkImg} height = {12} width = {12} onClick={() => copyHandler(true)}/>
                   &nbsp;
                  <img src = {OpenLinkImg} height = {12} width = {12} onClick={() => 
                    history.push(Routes.GraphNode(componentName, nodeName))}/>
                    &nbsp;
                   {nodeName} 
                </span>
                {copiedFullName && <CopiedComponent/>}
            </CAccordionHeader>
            </div>
            <CAccordionBody>
            {FileSystemComponent(mapOfComponents, nodeName, componentName, graphManager)}
            </CAccordionBody>
          </CAccordionItem>
        </CAccordion>
        
      </div>
    </div>
  );
}

function getDependencies(graphManager: GraphManager, componentName: string, nodeName: string): GraphOfNodes {
  const visited: { [key:string]:boolean; } = {}
  const queue: string[] = [nodeName]

  const mapOfNodes : Map<string, string[]> = new Map()

  while (queue.length != 0) {
    const bindingKey = queue.shift()

    if (!bindingKey || visited[bindingKey]) {
      continue;
    }
    visited[bindingKey] = true
    
    const binding = graphManager.getNode(componentName, bindingKey)
    if (binding) {
      // construct graph
      let listOfDependencies: string[] = []
      binding.dependencies.forEach(depedency => {
        if (!visited[depedency.key]) {
          listOfDependencies.push(depedency.key)
          queue.push(depedency.key)
        }
      })
      mapOfNodes.set(bindingKey, listOfDependencies)
    }
  }
  return {
    mapOfNodes: mapOfNodes
  }
}
