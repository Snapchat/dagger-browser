import { NextFunction, Request, Response } from "express";
import Config from "../src/models/Config"
import GraphManager from "../src/models/GraphManager"
import WeightServiceManager from "../src/service/WeightServiceManager";
import DisplayNameHelper from "../src/util/DisplayNameHelper";
import HttpException from "./util/HttpException";

const express = require( "express" );
const app = express();
const cors = require('cors')
const port = 8080; // default port to listen

// util, model and maps objects needed to build the Dagger-Graph
const displayNameHelper = new DisplayNameHelper()
const graphManager = new GraphManager()
const mapOfSubcomponents = new Map<string ,Map <string,string>>()          
const mapOfComponents = new Map<string,string>()

// used to reference query params in get Requests
interface Query {
  nodeName: string;
}
// uses env file
require('dotenv').config()

app.use(express.urlencoded({ extended: false }));
app.use(cors());

/* TODO: refresh function should load the <root>/build/ComponentsManifest.json file and use the methods
         provided from the models and service classes to initialize the dagger-graph in 'graphManager'
*/
async function refresh( loadedManifest: boolean, graphManager : GraphManager,  manifestUrl : string ) {
    if (!loadedManifest) {
      if (manifestUrl) {
        const success = await graphManager.loadUrl(manifestUrl);
        if (success) {
                new WeightServiceManager(graphManager)
                loadedManifest = true
        }
      }
    }
}
  
// define a route handler for the default home page
app.get( "/", ( req : Request, res: Response )  => {
    res.send( "Dagger Browser Server!" );
} );

// start the Express server
app.listen( port, () => {
  refresh(false, graphManager, Config.COMPONENTS_MANIFEST_JSON_URL)
  // construct graph when creating the server if graphManager is not null
  if (graphManager.componentSet.components.length != 0 ) {
    console.log("Graph is building")
    graphManager.componentSet.components.forEach(component => {
      mapOfComponents.set(displayNameHelper.displayNameForKey(component.name), component.name);
      mapOfSubcomponents.set(displayNameHelper.displayNameForKey(component.name), new Map<string, string>());
      component.nodes.forEach(node => {
        mapOfSubcomponents.get(displayNameHelper.displayNameForKey(component.name))?.set(displayNameHelper.displayNameForKey(node.key), node.key);
      });
    })
  }
    console.log( `Dagger-Browser server starting at http://localhost:${ port }` );
});

// fetchNode that checks if the nodeName is in the Dagger-Graph
app.get('/fetchNode/nodeName', async (request: Request<{}, {}, {}, Query>, response: Response ) => { 
  const { query } = request;
  //if nodeName is a parent component, then path `/node/Subcomponent` is not required
  if (mapOfComponents.has(query.nodeName)) {
    response.redirect(`http://localhost:3000/#/` + mapOfComponents.get(query.nodeName))
  } 
  // if nodeName is a child component, the first parent component found in the graph will be selected as the parent component
    else {       
      for (var i =0 ; i< mapOfSubcomponents.size; i++) {
        let key = mapOfSubcomponents.keys().next().value
        mapOfSubcomponents.get(key)?.forEach(element => {
          if(displayNameHelper.displayNameForKey(element) == query.nodeName) {
            response.redirect(`http://localhost:3000/#/` + mapOfComponents.get(key) + `/node/`+mapOfSubcomponents.get(key)?.get(query.nodeName))
          }
        });
      }
    }
   // if component/subcomponent is not found, user will then be redirected to the homepage
   response.redirect('http://localhost:3000/#/')
});

//error handler 
app.use(function error(err: HttpException, request: Request, response: Response, next: NextFunction) {
    //renders the error page
    const status = err.status || 500
    const message = err.message || 'Something went wrong'
    response
    .status(status)
    .send({
        status,
        message
    })
})