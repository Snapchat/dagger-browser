import React, { useMemo } from "react";
import GraphManager from "../models/GraphManager";
import { useHistory, Route, Switch } from "react-router";
import ComponentSummary from "./ComponentSummary";
import NodeAutosuggest from "./NodeAutosuggest";
import { BrowserHeader } from "./BrowserHeader";
import Home from "src/components/Home";
import { ModuleSummary } from "src/components/ModuleSummary";
import { NodeSearch, NodeSummary } from "src/components/NodeSummary";
import { ScopeSummary } from "./ScopeSummary";
import NodeClosure from "src/components/NodeClosure";
import SubcomponentSummary from "src/components/SubcomponentSummary";
import WeightSelector from "../components/WeightSelector";
import Routes, { Paths } from "src/Routes";
import WeightServiceManager from "../service/WeightServiceManager";
import classNames from "classnames";
import "./GraphBrowser.css";
import Config from "src/models/Config";
import TreeView from "src/components/TreeView"

interface Props {
  graphManager: GraphManager;
  weightServiceManager: WeightServiceManager;
  componentName: string;
}

export const GraphBrowser = ({ graphManager, weightServiceManager, componentName }: Props) => {
  const graph = useMemo(() => componentName && graphManager.getComponent(componentName), [
    graphManager,
    componentName
  ]);

  const history = useHistory();

  const weightService = weightServiceManager.getWeightService();

  const includeWeightSelector = weightServiceManager.getWeightServiceNames().length > 1;

  return (
    <div>
      <div className="container">
        <div className="row search-bar">
          <div className={classNames("col", includeWeightSelector ? "s9": "s12")}>
            <NodeAutosuggest
              graphManager={graphManager}
              weightService={weightService}
              componentName={graph && graph.name}
              onSelect={(componentName, node) =>
                history.push(Routes.GraphNode(componentName || "", node))
              }
            />
          </div>
          {includeWeightSelector &&
            <div className="col s3">
              <WeightSelector
                  weightServiceManager={weightServiceManager}
                  onSelectWeight={weight => {
                    weightServiceManager.selectWeightService(weight);
                    // Refresh the app state without affecting history.
                    history.replace('#');
                  }
                }
              />
            </div>
          }
        </div>
        <Switch>
          <Route
            path={Paths.Module}
            render={props => (
              <ModuleSummary
                graphManager={graphManager}
                weightService={weightService}
                moduleName={decodeURIComponent(props.match.params.module as string)}
                componentName={componentName}
              />
            )}
          ></Route>
          <Route
            path={Paths.GraphModule}
            render={props => (
              <ModuleSummary
                graphManager={graphManager}
                weightService={weightService}
                moduleName={decodeURIComponent(props.match.params.module as string)}
                componentName={componentName}
              />
            )}
          ></Route>
          <Route
            path={Paths.GraphScope}
            render={props => (
              <ScopeSummary
                graphManager={graphManager}
                weightService={weightService}
                scope={decodeURIComponent(props.match.params.scope as string)}
                componentName={componentName}
              />
            )}
          ></Route>
          <Route
            path={Paths.GraphClosure}
            render={props => (
              <NodeClosure
                graphManager={graphManager}
                nodeName={decodeURIComponent(props.match.params.key as string)}
                componentName={componentName}
              />
            )}
          ></Route>
          <Route
            path={Paths.Tree}
            render={props => (
              <TreeView
                graphManager={graphManager}
                nodeName={decodeURIComponent(props.match.params.key as string)}
                componentName={componentName}
                weightService={weightService}
              />
            )}
          ></Route>
          <Route
            path={Paths.SearchNode}
            render={props => (
              <NodeSearch
                graphManager={graphManager}
                weightService={weightService}
                nodeName={decodeURIComponent(props.match.params.nodeName as string)}
              />
            )}
          ></Route>
          <Route
            path={Paths.GraphNode}
            render={props => (
              <NodeSummary
                graphManager={graphManager}
                weightService={weightService}
                nodeName={decodeURIComponent(props.match.params.node as string)}
                componentName={componentName}
                fullDetails={true}
              />
            )}
          ></Route>
          <Route
            path={Paths.SubComponent}
            render={props => (
              <SubcomponentSummary
                graphManager={graphManager}
                subcomponentName={decodeURIComponent(props.match.params.subcomponent as string)}
                componentName={componentName}
                weightService={weightService}
              />
            )}
          ></Route>
          <Route
            path={Paths.Component}
            render={props => (
              <ComponentSummary
                componentName={decodeURIComponent(props.match.params.component as string)}
                graphManager={graphManager}
                weightService={weightService}
                onSelect={(componentName, node) =>
                  history.push(Routes.GraphNode(componentName || "", node))
                }
              />
            )}
          ></Route>
          <Route
            path=""
            render={props => (
              <Home
                graphManager={graphManager}
                weightServiceManager={weightServiceManager}
              />
            )}
          ></Route>
        </Switch>
      </div>
    </div>
  );
};

export default GraphBrowser;
