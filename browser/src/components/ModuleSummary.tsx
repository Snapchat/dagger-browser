import React from "react";
import GraphManager from "../models/GraphManager";
import { ALL_COMPONENTS } from "../models/GraphManager";
import { useHistory } from "react-router-dom";
import NodeLink from "./NodeLink";
import Routes from "src/Routes";
import WeightService from "../service/WeightService";

export type Props = {
  graphManager: GraphManager;
  weightService: WeightService;
  componentName: string;
  moduleName: string;
};

export function ModuleSummary({ componentName, moduleName, graphManager, weightService }: Props) {
  // Get auto suggestion result from graphManager
  const graphModule = graphManager.getModule(componentName, moduleName);
  const history = useHistory();

  if (!graphModule) {
    return (
      <div>
        Cannot find ${graphModule} module in ${componentName} graph
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-content">
        <div className="card-title">
          Module: {graphModule.key}
        </div>

        <h6>Bindings</h6>
        {graphModule.bindings.map(node => {
          return (
            <NodeLink
              key={node!.key}
              weight={weightService.getWeight(ALL_COMPONENTS, node!.key)}
              scoped={true}
              node={node!}
              onSelect={node => {
                history.push(Routes.GraphNode(componentName, node));
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
