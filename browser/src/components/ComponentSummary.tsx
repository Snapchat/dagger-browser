import React from "react";
import { useHistory } from "react-router-dom";
import Routes from "src/Routes";
import GraphManager from "../models/GraphManager";
import NodeLink from "./NodeLink";
import WeightService from "../service/WeightService";
import SubcomponentLink from "./SubcomponentLink";
import ComponentLink from "./ComponentLink";

type Props = {
  graphManager: GraphManager;
  weightService: WeightService;
  componentName: string;
  onSelect: (graphName: string, key: string) => any;
};

const ComponentSummary = ({ graphManager, weightService, componentName, onSelect }: Props) => {
  const graph = graphManager.getComponent(componentName);
  const history = useHistory();
  const scopedBindings = graph.nodes.filter(binding => !!binding.scope);
  const componentSet = new Set<string>();
  graph.nodes
    .filter(binding => binding.component != undefined && binding.component !== componentName)
    .forEach(binding => componentSet.add(binding.component as string));

  const membersInjectors = graph.nodes.filter(
      binding =>
        binding.kind === "MEMBERS_INJECTION"
    );

  const multiBindings = graph.nodes.filter(
    binding =>
      binding.kind === "MULTIBOUND_SET" || binding.kind === "MULTIBOUND_MAP"
  );

  scopedBindings.sort((nodeA, nodeB) => {
    const weightA = weightService.getWeight(componentName, nodeA.key);
    const weightB = weightService.getWeight(componentName, nodeB.key);
    return (weightB ? weightB.value : 0) - (weightA ? weightA.value : 0);
  });

  multiBindings.sort((nodeA, nodeB) => {
    const weightA = weightService.getWeight(componentName, nodeA.key);
    const weightB = weightService.getWeight(componentName, nodeB.key);
    return (weightB ? weightB.value : 0) - (weightA ? weightA.value : 0);
  });

  return (
    <div className="card">
      <div className="card-content">
        <div className="card-title">
          <ComponentLink
            componentName={componentName}
            weight={weightService.getWeight(componentName)}
          />
        </div>

        {membersInjectors.length > 0 &&
          <div>
          <br />
          <h6>Members Injectors:</h6>
          {membersInjectors.map(binding => {
            return (
              <NodeLink
                key={binding.key}
                weight={weightService.getWeight(componentName, binding.key)}
                scoped={true}
                node={binding}
                onSelect={node => onSelect(componentName, node)}
              />
            );
          })}
        </div>
        }

        {componentSet.size > 0 &&
          <div>
            <br />
            <h6>{componentSet.size} Subcomponents:</h6>
            {Array.from(componentSet).map(subcomponent => {
              return (
                <SubcomponentLink
                  subcomponentName={subcomponent}
                  weight={graphManager.getSubcomponentWeight(subcomponent)}
                  onSelect={node =>
                    history.push(Routes.SubComponent(componentName, subcomponent))
                  }
                />
              );
            })}
          </div>
        }

        {multiBindings.length > 0 &&
          <div>
            <br />
            <h6>{multiBindings.length} Multibindings:</h6>
            {multiBindings.map(binding => {
              return (
                <NodeLink
                  key={binding.key}
                  weight={weightService.getWeight(componentName, binding.key)}
                  scoped={true}
                  node={binding}
                  onSelect={node => onSelect(componentName, node)}
                />
              );
            })}
          </div>
        }

        {scopedBindings.length > 0 &&
          <div>
            <br />
            <h6>{scopedBindings.length} Scoped Bindings:</h6>
            {scopedBindings.map(binding => {
              return (
                <NodeLink
                  key={binding.key}
                  weight={weightService.getWeight(componentName, binding.key)}
                  scoped={true}
                  node={binding}
                  onSelect={node => onSelect(componentName, node)}
                />
              );
            })}
          </div>
        }

      </div>
    </div>
  );
};

export default ComponentSummary;
