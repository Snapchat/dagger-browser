import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import GraphManager from "../models/GraphManager";
import Routes from "src/Routes";
import WeightService from "../service/WeightService";
import NodeWeight from "./NodeWeight";
import NodeIcon from "./NodeIcon";
import DisplayNameHelper from "../util/DisplayNameHelper";
import { MDBContainer, MDBCol, MDBTreeview, MDBTreeviewList, MDBTreeviewItem } from 'mdbreact';

type Props = {
  graphManager: GraphManager,
  componentName: string,
  nodeName: string;
  weightService: WeightService;
};

type GraphOfNodes = {
  mapOfNodes : Map<string, string[]>
}

function MDBFileSystemComponentNew (mapOfNodes:  Map<string, string[]>, nodeName: string, componentName: string, graphManager: GraphManager,   weightService: WeightService)  {
  const displayNameHelper = new DisplayNameHelper()
  const history = useHistory();
  const rootNode = graphManager.getNode(componentName, nodeName)
  const dependenciesIconMap: Map<string,string> = new Map()
  if(rootNode && rootNode.dependencies.length > 0) {
    rootNode.dependencies.map(node => {
      dependenciesIconMap.set(node.key, node.kind)
    })
  }
  
  return (
    <div>
      {mapOfNodes.get(nodeName)?.map(node => {       
        let isInstance = false
        if(dependenciesIconMap.get(node) && dependenciesIconMap.get(node) == "INSTANCE") {
          isInstance = true
        }
        let weight = weightService.getWeight(componentName, node)
          if (mapOfNodes.get(node)?.length != 0) { 
            return (
              <div style={{"padding" : "10px"}}>
                  <NodeIcon kind = {dependenciesIconMap.get(node)}/>
                  <span onClick={() => history.push(Routes.GraphNode(componentName, node))}>
                        {displayNameHelper.displayNameForKey(node)}
                  </span>
                  <NodeWeight weight={weight}/>
                <MDBTreeviewList icon ="none" opened={isInstance} fal tag = "span">
                  {MDBFileSystemComponentNew(mapOfNodes, node, componentName, graphManager, weightService)}
                </MDBTreeviewList>
              </div>
            )
          } else {
            return (
              <div style={{"padding" : "10px"}}>
                <NodeIcon kind = {dependenciesIconMap.get(node)}/>
                <span onClick={() => history.push(Routes.GraphNode(componentName, node))}>
                      {displayNameHelper.displayNameForKey(node)}
                </span>
                <NodeWeight weight={weight} />
              </div>
            )
          }
        })
      }
    </div>
  )
}

export default function TreeView({ graphManager, componentName, nodeName, weightService}: Props) {

  const dependencies = getDependencies(graphManager, componentName, nodeName);
  const history = useHistory();
  const displayNameHelper = new DisplayNameHelper()
  const mapOfComponents = dependencies.mapOfNodes

  return (
    <div className="card">
      <div className="card-content">    
        <div className="card-title">
            Tree for: {displayNameHelper.displayNameForKey(nodeName)} 
        </div> 
        <div className="card-title">
            Component: {componentName.substr(componentName.lastIndexOf(".") + 1)} 
        </div> 
        <MDBContainer>
        <MDBCol>
          <MDBTreeview className='w-200'>
            <span onClick={() => history.push(Routes.GraphNode(componentName, nodeName))}>
                      {displayNameHelper.displayNameForKey(nodeName)}
            </span>
            <MDBTreeviewList  icon ="none" opened = {true} far tag = "span">
              {MDBFileSystemComponentNew(mapOfComponents, nodeName, componentName, graphManager, weightService)}
            </MDBTreeviewList>
          </MDBTreeview>
        </MDBCol>
      </MDBContainer>
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
