import GraphManager from "../models/GraphManager";
import GraphReducer from "../models/GraphReducer";
import { Weight } from "../models/Graph";
import WeightService from "./WeightService";

const LARGE_THRESHOLD = 500;
const SMALL_THRESHOLD = 10;

/** Service that computes the number of bindings for a given component and node. */
export default class BindingsService implements WeightService {

  private nodeWeights: { [componentName: string]: { [key: string]: Weight } };
  private graphManager: GraphManager;

  constructor(graphManager: GraphManager) {
    this.graphManager = graphManager;
    this.nodeWeights = {};
  }

  getWeight(componentName: string, node?: string): Weight | undefined {
    if (node) {
      if (!this.nodeWeights[componentName]) {
        this.nodeWeights[componentName] = {};
      }
      if (!this.nodeWeights[componentName][node]) {
        this.nodeWeights[componentName][node] =
            this.graphManager.computeNodeWeight(componentName, node, new GraphReducerImpl());
      }
      return this.nodeWeights[componentName][node];
    } else {
      return {
        value: this.graphManager.getComponent(componentName).nodes.length,
        largeThreshold: LARGE_THRESHOLD,
        smallThreshold: SMALL_THRESHOLD
      } as Weight;
    }
  }
}

class GraphReducerImpl implements GraphReducer {
  weight: Weight;

  constructor() {
    this.weight = {
      value: 0,
      largeThreshold: LARGE_THRESHOLD,
      smallThreshold: SMALL_THRESHOLD
    } as Weight;
  }

  reduce(key: string) {
    this.weight.value++;
  }

  result(): Weight {
    return this.weight;
  }
}
