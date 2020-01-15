import React from "react";
import DaggerBrowser from "./components/GraphBrowser";
import GraphBrowserLoader from "./components/GraphBrowserLoader";
import { Route, HashRouter } from "react-router-dom";
import GraphManager from "./models/GraphManager";
import { QueryParamProvider } from "use-query-params";
import { Paths } from "./Routes";
import WeightServiceManager from "./service/WeightServiceManager";
import { BrowserHeader } from "./components/BrowserHeader";
import Config from "./models/Config";

interface AppState {
  manifestUrl: string;
  loadedUrl?: string;
  weightServiceManager?: WeightServiceManager
}

class App extends React.Component<any, AppState> {
  private graphManager = new GraphManager();
  
  constructor(props: any) {
    super(props);
    this.state = {
      manifestUrl: Config.COMPONENTS_MANIFEST_JSON_URL
    };
  }

  componentDidMount() {
    this.refresh()
  }

  componentDidUpdate() {
    this.refresh()
  }

  async refresh() {
    if (this.state.manifestUrl != this.state.loadedUrl) {
      const success = await this.graphManager.load(this.state.manifestUrl);
      this.setState({
        weightServiceManager: success ? new WeightServiceManager(this.graphManager) : undefined,
        loadedUrl: this.state.manifestUrl
      })      
    }
  }

  private onChangeManifestUrl(url: string) {
    this.setState({
      manifestUrl: url,
      loadedUrl: undefined
    })
  }

  render() {
    return <HashRouter>
      <QueryParamProvider ReactRouterRoute={Route}>
        <Route  
          path={Paths.Home}
          render={props => (
            <div>
              <BrowserHeader manifestUrl={this.graphManager.manifestUrl} onChangeManifestUrl={(url) => this.onChangeManifestUrl(url)} />
              {this.state.weightServiceManager ? (
                <DaggerBrowser
                  componentName={props.match.params.component ? decodeURIComponent(props.match.params.component) : ""}
                  graphManager={this.graphManager}
                  weightServiceManager={this.state.weightServiceManager}
                />
              ) : (
                <GraphBrowserLoader loaded={this.state.loadedUrl != undefined} onChangeManifestUrl={(url) => this.onChangeManifestUrl(url)} />
              )}
            </div>
          )}
        />
      </QueryParamProvider>
    </HashRouter>;
  }
}

export default App;
