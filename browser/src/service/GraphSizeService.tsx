import ClassSize, { ClassInfo } from "../models/ClassSize";
import GraphManager from "../models/GraphManager";
import GraphReducer from "../models/GraphReducer";
import { Weight } from "../models/Graph";
import ClassSizeService  from "./ClassSizeService";
import WeightService from "./WeightService";

const LARGE_THRESHOLD_KB = 1000; // Nodes over 1MB are considered "large"
const SMALL_THRESHOLD_KB = 50; // Nodes less than 50KB are considered "small"

/**
 * Service to compute the graph weight in terms of memory.
 * This is based on transitive dependencies per node and on the methods, fields, and dex code size.
 */
export default class GraphSizeService implements WeightService {

  private nodeWeights: { [componentName: string]: { [key: string]: Weight } };
  private graphManager: GraphManager;
  private classSizeService: ClassSizeService;

  constructor(graphManager: GraphManager, classSizeService: ClassSizeService) {
    this.graphManager = graphManager;
    this.classSizeService = classSizeService;
    this.nodeWeights = {};
  }

  getWeight(componentName: string, node?: string): Weight | undefined {
    if (!this.nodeWeights[componentName]) {
      this.nodeWeights[componentName] = {};
    }

    if (node) {
      if (!this.nodeWeights[componentName][node]) {
        const graphReducer = new GraphReducerImpl(this.classSizeService, node);
        this.nodeWeights[componentName][node] =
            this.graphManager.computeNodeWeight(componentName, node, graphReducer);
      }
      return this.nodeWeights[componentName][node];
    } else {
      if (!this.nodeWeights[componentName][componentName]) {
        const nodes = Object.assign([], this.graphManager.getComponent(componentName).nodes);
        const graphReducer = new GraphReducerImpl(this.classSizeService, componentName);
        this.nodeWeights[componentName][componentName] =
            this.graphManager.computeWeightForNodes(componentName, nodes, graphReducer);
      }
      return this.nodeWeights[componentName][componentName];
    }
  }
}

class GraphReducerImpl implements GraphReducer {
  private classSize: ClassSize;
  private classSizeService: ClassSizeService;

  /**
   * Tracks nodes that have already been reduced. This is necessary to count Dagger modules
   * just once. They may be a common dependency and counted multiple times.
   */
  private reduced: Set<string>;

  constructor(classSizeService: ClassSizeService, initialKey: string) {
    this.classSizeService = classSizeService;
    this.reduced = new Set();

    const classInfo = {
      'field_count': 0,
      'method_count': 0,
      'lambda_count': 0,
      'size': 0,
      'inner_class_count': 0
    } as ClassInfo;
    this.classSize = new ClassSize(classInfo);
    const parentClassSize = this.classSizeService.getClassSize(initialKey);
    if (parentClassSize) {
      this.classSize.add(parentClassSize);
    }
  }

  reduce(key: string) {
    if (this.reduced.has(key)) {
      return;
    }

    this.reduced.add(key);
    const childClassSize = this.classSizeService.getClassSize(key);
    if (childClassSize) {
      this.classSize.add(childClassSize);
    }
  }

  result(): Weight {
    return {
      value: Math.round(this.classSize.getMemorySize() / 1024),
      largeThreshold: LARGE_THRESHOLD_KB,
      smallThreshold: SMALL_THRESHOLD_KB,
      summary: this.classSize.getSummary(),
      unit: 'kB'
    } as Weight;
  }
}