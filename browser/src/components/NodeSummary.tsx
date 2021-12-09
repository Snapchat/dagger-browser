import React from "react";
import GraphManager, { GraphMatchResult } from "../models/GraphManager";
import { Link, useHistory } from "react-router-dom";
import NodeLink from "./NodeLink";
import Routes from "src/Routes";
import { GraphSelector } from "./GraphSelector";
import WeightService from "../service/WeightService";
import { Node } from "src/models/Graph";
import DisplayNameHelper from "src/util/DisplayNameHelper";

export type Props = {
  graphManager: GraphManager;
  weightService: WeightService;
  componentName: string;
  nodeName: string;
  fullDetails: boolean;
};

export type SearchProps = {
  graphManager: GraphManager;
  weightService: WeightService;
  nodeName: string;
};

function readableKind(kind: String) {
  // https://github.com/google/dagger/blob/master/java/dagger/model/BindingKind.java
  switch(kind) {
    case "PROVISION":
      return "Module provision"
    case "INJECTION":
      return "@Inject constructor"
    case "DELEGATE":
      return "@Binds delegate"
    case "MEMBERS_INJECTION":
        return "Members Injector"
    case "COMPONENT":
      return "Component"
    case "COMPONENT_DEPENDENCY":
      return "Component Dependency"
    case "COMPONENT_PROVISION":
      return "Component Provision"
    case "COMPONENT_PRODUCTION":
      return "Component Production"
    case "BOUND_INSTANCE":
      return "Bound instance"
    case "MULTIBOUND_SET":
      return "Multibound Set"
    case "MULTIBOUND_MAP":
      return "Multibound Map"
    case "OPTIONAL":
      return "Optional"
    case "SUBCOMPONENT_CREATOR":
      return "Subcomponent Creator"
  }

  return kind
}

function getProvidingComponents(graphManager: GraphManager, componentName: string, node: Node) {
  var components = graphManager.getDependencyProviders(node.key)
  if (components === undefined) {
    return undefined
  }

  return components.map(t => 
    <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <Link
        className="soft-link"
        to={Routes.Component(t)}
      >{t.substring(1 + t.lastIndexOf('.'))}
      </Link>
      &nbsp;|&nbsp;
      <Link
        className="soft-link"
        to={Routes.GraphNode(t, node.key)}
      >Implementation
      </Link>
    </div>
  )
}

function createdComponent(graphManager: GraphManager, componentName: string, node: Node) {
  if (!node.adjacentNodes) {
    return ""
  }
  
  for (var nodeKey of node.adjacentNodes) {
    var componentNode = graphManager.getNode(componentName, nodeKey);
    // Node.Kind will be null for ComponentNodes
    // Node.key == componentName for parent components
    if (componentNode && !componentNode.kind && nodeKey != componentName) {
      return nodeKey
    }
  }
  return ""
}

export function NodeSearch({ graphManager, weightService, nodeName }: SearchProps) {
  //search for the top five choices the nodeName could be in the Graph based on the nodeName
  //use component name in angle brackets as the nodeName
    let searchResult: GraphMatchResult[] = searchHandler(nodeName, graphManager)
    if(searchResult.length == 1) {
      // return full summary for the one result found
      var props: Props = {graphManager, weightService, componentName : searchResult[0].componentName, nodeName : searchResult[0].node.key, fullDetails : true}
      return NodeSummary(props)
    } else if (searchResult.length > 1) {
      if (displayFullSummary(searchResult, nodeName)) {
        // return full node Summary if exactly 1 of the result nodes are equal to the short name of a node 
        const displayNameHelper = new DisplayNameHelper()
        let uniqueName = searchResult.filter(component => displayNameHelper.displayNameForKey(component.node.key) == nodeName)
        var props: Props = {graphManager, weightService, componentName : uniqueName[0].componentName, nodeName : uniqueName[0].node.key, fullDetails : true}
        return NodeSummary(props)
      } else {
        // will partially display each nodes summary
          return (
            <div>
              {searchResult.map(component => {
                var prop : Props = {graphManager, weightService, componentName : component.componentName, nodeName : component.node.key, fullDetails: false}
                return NodeSummary(prop)
              })}
            </div>
          )
      }
    } else {
      // return if nodeName is not found in the graph
      return (
        <div>
          Results for node name <strong><i>{nodeName}</i></strong> are not found in graph.
        </div>
      )
    }
}

function displayFullSummary(searchResult: GraphMatchResult[], nodeName: string) : boolean {
  const displayNameHelper = new DisplayNameHelper()
  //counts how many short names in the graph equal to the nodeName 
  var commonCount = searchResult.filter(component => displayNameHelper.displayNameForKey(component.node.key) == nodeName);
  // return false if there isn't a unique shortName equal to the nodeName
  if (commonCount.length != 1) {
    return false
  }
  return true
}

function searchHandler(nodeName: string, graphManager: GraphManager): GraphMatchResult[] {
  const displayNameHelper = new DisplayNameHelper()
// replace angle brackets , annotation '@', & commas with ' ' to create tokens
  nodeName = nodeName.replace(/<|>|@|,/g,' ');
  // create list of tokens
  let tokenList : string[] = nodeName.split(' ').filter(token => token != "")
  // list of components found based on tokens
  let resultComponents: GraphMatchResult[] = []
  let setOfComponents: Set<string> = new Set()
  tokenList.forEach(token => {
    //get search results for each token
    var searchResult: GraphMatchResult[] = graphManager.getMatches("", token, 40, false);
    searchResult.forEach(component => {
      // check if every token in tokenList is included in a component
      let addComponent : boolean = tokenList.every(token => displayNameHelper.displayNameForKey(component.node.key).includes(token))
      // do not add if component is a duplicate & components list < 5
      if(addComponent && !setOfComponents.has(component.node.key) && resultComponents.length < 5){
        resultComponents.push(component)
          setOfComponents.add(component.node.key)
      }
    })
  })
  return resultComponents
}

export function NodeSummary({ graphManager, weightService, componentName, nodeName, fullDetails }: Props) {
  const history = useHistory();
  const displayNameHelper = new DisplayNameHelper()
  const node = graphManager.getNode(componentName, nodeName);

  if (!node) {
    return (
      <div>
      Cannot find <strong>{nodeName}</strong> node in <strong>{componentName}</strong> graph
      </div>
    );
  }

  const bindingModule = node.module;
  const availableGraphs = graphManager.getMatches("", node.key, 40, true).map(it => it.componentName)
  const callsites = graphManager.getCallsites(componentName, node.key);
  const bindingKind = readableKind(node.kind)
  const componentSimpleName = componentName.substring(componentName.lastIndexOf('.') + 1)
  const simpleScope = node.scope && node.scope.substring(node.scope.lastIndexOf('.') + 1)
  const createdComponentKey: string = createdComponent(graphManager, componentName ,node);
  const providingComponents = getProvidingComponents(graphManager, componentName ,node);

  return (
    <div className="card">
      <div className="card-content">
        <div className="card-title">
          <NodeLink
              node={node}
              weight={weightService.getWeight(componentName, node.key)}
              onSelect={() => 
                history.push(Routes.GraphNode(componentName, node.key))
              }
              />
        </div>

        <p>
          <span className="unselectable">Component: </span>
          {availableGraphs.length == 1 &&
          <Link
            className="soft-link"
            to={Routes.Component(componentName)}
          >
            {componentSimpleName}
          </Link>
          }
          {availableGraphs.length > 1 &&
          <GraphSelector
              componentName={componentName}
              graphs={availableGraphs}
              selectGraph={graph => history.push(Routes.GraphNode(graph, node.key))}
          />
          }
        </p>


        {node.component && (componentName !== node.component) && (
        <p>
        <span className="unselectable">Subcomponent: </span>
        <Link
                className="soft-link"
                to={Routes.SubComponent(componentName, node.component)}
              >
              <div className="tooltip_link">
              {displayNameHelper.displayNameForKey(node.component)}
                <span className="tooltiptext_link">{node.component}</span>
              </div>
          </Link>
        </p>
        )}

        <p>
          <span>Type: </span>
          {bindingKind}
          {createdComponentKey && 
            <span className="unselectable"> | &nbsp;
            <Link
                    className="soft-link"
                    to={Routes.GraphNode(componentName, createdComponentKey)}
                  >
                    {createdComponentKey}
              </Link>
              </span>
            }
        </p>

        {node.scope && (
          <p>
            <span className="unselectable">Scope: </span>
            <Link
                className="soft-link"
                to={Routes.GraphScope(componentName, node.scope)}
              >
                @{simpleScope}
              </Link>
          </p>
        )}

        {node.module && (
          <p>
            <span className="unselectable">Module: </span>
            {bindingModule ? (
              <Link
                className="soft-link"
                to={Routes.GraphModule(componentName, node.module)}
              >
                <div className="tooltip_link">
                  {displayNameHelper.displayNameForKey(bindingModule)}
                  <span className="tooltiptext_link">{bindingModule}</span>
              </div>
              </Link>
            ) : (
              <span>n/a</span>
            )}
          </p>
        )}

        {node.kind == "COMPONENT_PROVISION" && (
          <p>
          <span className="unselectable">Provided by: </span>
          {providingComponents}
        </p>
        )}

        <br />
  {fullDetails && 
  <div> 
        <h6>Dependencies
          &nbsp;|&nbsp;
          <Link
            className="soft-link"
            to={Routes.GraphClosure(componentName, node.key)}
          >
          Transitive
          </Link>
          &nbsp;|&nbsp;
          <Link
            className="soft-link"
            to={Routes.Tree(componentName, node.key)}
          >
          Tree
          </Link>
        </h6>
        {node &&
          node.dependencies
            .map(d => ({
              node: graphManager.getNode(componentName, d.key),
              dep: d
            }))
            .filter(({ node }) => node !== undefined)
            .map(({ node, dep }) => {
              return (
                <NodeLink
                  key={node!.key}
                  weight={weightService.getWeight(componentName, node!.key)}
                  kind={dep.kind}
                  scoped={true}
                  node={node!}
                  onSelect={node =>
                    history.push(Routes.GraphNode(componentName, node))
                  }
                />
              );
            })}
        {!node || (node.dependencies.length === 0 && <div>None</div>)}
        <br />
        <h6>Callsites</h6>
        {callsites.map(binding => {
          return (
            <NodeLink
              key={binding.key}
              node={binding}
              kind={binding.kind}
              scoped={true}
              onSelect={node => history.push(Routes.GraphNode(componentName, node))}
            />
          );
        })}
        {callsites.length === 0 && <div>None</div>}
        </div>
        }
      </div>
    </div>
  );
}
