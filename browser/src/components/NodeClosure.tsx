import React from "react";
import { Link, useHistory } from "react-router-dom";
import { Node } from "../models/Graph";
import GraphManager from "../models/GraphManager";
import Routes from "src/Routes";
import NodeLink from "./NodeLink";

const NO_SCOPE = "@"

type Props = {
  graphManager: GraphManager,
  componentName: string,
  nodeName: string;
};

type Dependencies = {
  bindings: { [key:string]:Node[]; }
  modules: { [key:string]:Node[]; }
  moduleSummary: { [key:string]:number; }
}

export default function NodeClosure({ graphManager, componentName, nodeName }: Props) {

  const dependencies = getDependencies(graphManager, componentName, nodeName);

  const scopedDependencies = Object.keys(dependencies.bindings).filter((scope: string) => {
    return scope != NO_SCOPE && scope != "@dagger.Reusable"
  });

  const modules = Object.keys(dependencies.modules);

  const history = useHistory();

  return (
    <div className="card">
      <div className="card-content">
        <div className="card-title">
          Transitive Dependencies: {nodeName}
        </div>      

        {scopedDependencies.length > 0 && (
          <div>
            <br/>
            <h6>Scoped Bindings</h6>
            { scopedDependencies.map((scope: string) => {
              return (<div>
                <p>{getScopeDisplayName(scope)}</p>
                {dependencies.bindings[scope].map((binding: Node) => {
                return (
                  <div>{binding.key}</div>
                )  
              })}</div>)
            })}
          </div>
        )}

        {modules.length > 0 && (
          <div>
            <br/>
            <h6>Module Bindings</h6>
            { modules.map((module: string) => {
              return (
                <div>
                  <div>
                    <Link className="soft-link" to={Routes.GraphModule(componentName, module)}>
                      {getModuleDisplayName(module)}
                    </Link>
                    &nbsp;
                    (
                    {dependencies.modules[module].length}
                    /
                    {dependencies.moduleSummary[module]}
                    )
                  </div>
                  {dependencies.modules[module].map((binding: Node) => {
                    return (
                      <NodeLink
                        key={binding.key}
                        node={binding}
                        kind={binding.kind}
                        scoped={true}
                        onSelect={node => history.push(Routes.GraphNode(componentName, binding.key))}
                      />
                    );  
                  })}
                </div>
              )
            })}
          </div>
        )}          
      </div>
    </div>
  );
}

function getDependencies(graphManager: GraphManager, componentName: string, nodeName: string): Dependencies {
  const visited: { [key:string]:boolean; } = {}
  const queue: string[] = [nodeName]

  const bindings: { [key:string]:Node[]; } = {}
  const moduleBindings: { [key:string]:Node[]; } = {}
  const moduleSummary: { [key:string]:number } = {}
  

  // Module overviews
  graphManager.getComponent(componentName).nodes.forEach(node => {
    const module = node.module
    if (module) {
      moduleSummary[module] = (moduleSummary[module] || 0) + 1
    }
  })

  while (queue.length != 0) {
    const bindingKey = queue.shift()

    if (!bindingKey || visited[bindingKey]) {
      continue;
    }
    visited[bindingKey] = true
    
    const binding = graphManager.getNode(componentName, bindingKey)
    if (binding) {
      // Add this binding to our output
      if (binding.module) {
        var mb = moduleBindings[binding.module] || (moduleBindings[binding.module] = [])
        mb.push(binding)
      } else {
        var sb = bindings[binding.scope || NO_SCOPE] || (bindings[binding.scope || NO_SCOPE] = [])
        sb.push(binding)
      }
      
      // Crawl binding dependencies
      binding.dependencies.forEach(dep => {
        queue.push(dep.key)
      })
    }
  }

  return {
    bindings: bindings,
    modules: moduleBindings,
    moduleSummary: moduleSummary
  }
}

function getScopeDisplayName(scope: string): string {
  const idx = scope.lastIndexOf(".")
  if (idx === -1) {
    return scope
  }
  return "@" + scope.substring(idx + 1)
}

function getModuleDisplayName(module: string): string {
  const parts = module.split(".")
  if (parts.length == 0) {
    return module
  }
  var i = 0
  while (i < parts.length && parts[i][0] !== parts[i][0].toUpperCase()) {
    i++;
  }
  if (i < parts.length) {
    return parts.slice(i, parts.length).join(".")
  }
  return module
}
