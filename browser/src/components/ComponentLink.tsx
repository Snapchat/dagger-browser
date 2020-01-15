import React from "react";
import { Node, Weight } from "../models/Graph";
import CodeLink from "./CodeLink";
import Routes from "src/Routes";
import NodeWeight from "./NodeWeight";
import { Link } from "react-router-dom";

type Props = {
  componentName: string;
  weight?: Weight;
};

const ComponentLink: React.FC<Props> = ({
  componentName,
  weight = undefined
}: Props) => {
  return (<div>
    <div className="binding">
      <div className="text">
        <Link to={Routes.Component(componentName)}>
        {componentName}
        </Link>
      </div>
      <div>
        <CodeLink link={componentName} />
        <NodeWeight weight={weight} />
      </div>
    </div>
    </div>
  );

};

export default ComponentLink;
