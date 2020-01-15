import React from "react";
import GraphManager from "../models/GraphManager";
import { Link } from "react-router-dom";
import Routes from "src/Routes";
import CodeLink from "./CodeLink";
import NodeWeight from "./NodeWeight";
import WeightServiceManager from "../service/WeightServiceManager";
import ComponentLink from "./ComponentLink";

type Props = {
  graphManager: GraphManager;
  weightServiceManager: WeightServiceManager;
};

const Home = ({ graphManager, weightServiceManager }: Props) => {

  var components = graphManager.componentSet.components

  const weightService = weightServiceManager.getWeightService();

  return (
    <div className="card">
      <div className="card-content">
        <div className="card-title">Components</div>
        {components.map(component => {
          return <ComponentLink
            componentName={component.name}
            weight={weightService.getWeight(component.name)}
          />
        })}
      </div>
    </div>
  );
};

export default Home;
