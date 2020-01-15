import React from "react";
import { useHistory } from "react-router-dom";
import Routes from "src/Routes";
import GraphManager from "../models/GraphManager";
import NodeLink from "./NodeLink";
import WeightService from "../service/WeightService";

type Props = {
    graphManager: GraphManager;
    subcomponentName: string;
    componentName: string;
    weightService: WeightService;
  };


const SubcomponentSummary = ({ graphManager, subcomponentName, componentName, weightService}: Props) => {
    const totalBinds = graphManager.getSubcomponentBindings(componentName, subcomponentName)
    const history = useHistory();
    totalBinds.sort((nodeA, nodeB) => {
        const weightA = weightService.getWeight(componentName, nodeA.key);
        const weightB = weightService.getWeight(componentName, nodeB.key);
        return (weightB ? weightB.value : 0) - (weightA ? weightA.value : 0)
    });

    return (
      <div className="card">
        <div className="card-content">
          <div className="card-title">{subcomponentName}</div>
          <div>{totalBinds.length} total bindings.</div>

          <div>
          {totalBinds.map(binding => {
            return (
              <NodeLink
                key={binding.key}
                weight={weightService.getWeight(componentName, binding.key)}
                kind={binding.kind}
                scoped={true}
                node={binding}
                onSelect={node => history.push(Routes.GraphNode(componentName, binding.key))}
              />
            );
          })}
          </div>

        </div>
      </div>
    );
};

export default SubcomponentSummary;
