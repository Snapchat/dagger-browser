import React from "react";
import GraphManager from "../models/GraphManager";
import { ALL_COMPONENTS } from "../models/GraphManager";
import { useHistory } from "react-router-dom";
import NodeLink from "./NodeLink";
import WeightService from "../service/WeightService";

export type Props = {
  graphManager: GraphManager;
  weightService: WeightService;
  componentName: string;
  scope: string;
};

export function ScopeSummary({ graphManager, weightService, componentName, scope }: Props) {
  const graphScope = graphManager.getScope(componentName, scope);
  const history = useHistory();

  if (!graphScope) {
    return (
      <div>
        Cannot find ${graphScope} module in ${componentName} graph
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-content">
        <div className="card-title">
          Scope
          <br />
          {graphScope.scope}
        </div>

        <div className="row">
          <div className="col s12">
            <h6>Bindings ({graphScope.bindings.length})</h6>
            {graphScope.bindings.map(node => {
              return (
                <NodeLink
                  key={node.key}
                  weight={weightService.getWeight(ALL_COMPONENTS, node.key)}
                  scoped={true}
                  node={node}
                  onSelect={node => {
                    history.push(`/${componentName}/node/${node}`);
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
