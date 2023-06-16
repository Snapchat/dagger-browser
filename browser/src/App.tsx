import React from "react"
import DaggerBrowser from "./components/GraphBrowser";
import GraphBrowserLoader from "./components/GraphBrowserLoader";
import { Route, HashRouter } from "react-router-dom";
import GraphManager from "./models/GraphManager";
import { QueryParamProvider } from "use-query-params";
import { Paths } from "./Routes";
import WeightServiceManager from "./service/WeightServiceManager";
import { BrowserHeader } from "./components/BrowserHeader";
import FileDropzone from "./components/FileDropzone";
import Config from "./models/Config";

interface AppState {
  manifestUrl?: string;
  gzippedManifestUrl?: string;
  manifestFile?: File
  loadedManifest: boolean;
  weightServiceManager?: WeightServiceManager
}

class App extends React.Component<any, AppState> {
  private graphManager = new GraphManager();
  
  constructor(props: any) {
    super(props);
    this.state = {
      manifestUrl: Config.COMPONENTS_MANIFEST_JSON_URL,
      gzippedManifestUrl: Config.COMPONENTS_MANIFEST_GZIP_URL,
      loadedManifest: false
    };
  }

  componentDidMount() {
    this.refresh()
  }

  componentDidUpdate() {
    this.refresh()
  }

  async refresh() {
    if (!this.state.loadedManifest) {
      if (this.state.manifestFile) {
        const success = await this.graphManager.loadFile(this.state.manifestFile);
        this.setState({
          weightServiceManager: success ? new WeightServiceManager(this.graphManager) : undefined,
          loadedManifest: true
        }) 
      } else if (this.state.manifestUrl) {
        const success = await this.graphManager.loadUrl(this.state.manifestUrl, this.state.gzippedManifestUrl);
        this.setState({
          weightServiceManager: success ? new WeightServiceManager(this.graphManager) : undefined,
          loadedManifest: true
        })      
      }
    }
  }

  private onChangeManifestUrl(url: string) {
    this.setState({
      manifestUrl: url,
      loadedManifest: false
    })
  }

  private onChangeManifestFile(acceptedFiles: File[]) {
    if (acceptedFiles.length !== 1) {
      alert("Upload a single ComponentsManifest.json")
      return
    }

    const file = acceptedFiles[0]
    if (file.type != "application/json") {
      alert("Manifest must be a json file")
      return
    }

    this.setState({
      manifestFile: file,
      loadedManifest: false
    })
  }

  render() {
    return <HashRouter>
      <QueryParamProvider ReactRouterRoute={Route}>
        <Route  
          path={Paths.Home}
          render={props => (
              <FileDropzone onFilesSelected={(files) => this.onChangeManifestFile(files)}>
                <div>
                  <BrowserHeader manifestUrl={this.graphManager.manifestUrl} onChangeManifestUrl={(url) => this.onChangeManifestUrl(url)} />
                  {this.state.weightServiceManager ? (
                    <DaggerBrowser
                      componentName={props.match.params.component ? decodeURIComponent(props.match.params.component) : ""}
                      graphManager={this.graphManager}
                      weightServiceManager={this.state.weightServiceManager}
                    />
                  ) : (
                      <GraphBrowserLoader loaded={this.state.loadedManifest} onChangeManifestUrl={(url) => this.onChangeManifestUrl(url)} />
                    )}
                </div>
            </FileDropzone>
          )}
        />
      </QueryParamProvider>
    </HashRouter>;
  }
}


export default App;
