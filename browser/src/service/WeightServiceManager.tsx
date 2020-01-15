import GraphManager from "../models/GraphManager";
import BindingsService from "./BindingsService";
import ClassSizeService from "./ClassSizeService";
import GraphSizeService from "./GraphSizeService";
import WeightService from "./WeightService";

/** Manages currently selected weight service. */
export default class WeightServiceManager {

  private weightServices: { [key: string]: WeightService };
  private weightService: WeightService;

  constructor(graphManager: GraphManager) {
    // Add bindings count as the default service.
    this.weightServices = {};
    this.weightService = this.weightServices['bindings'] = new BindingsService(graphManager);

    // TODO: Separate services into a config file.
    if (graphManager.classInfo && Object.keys(graphManager.classInfo).length) { 
      const classSizeService = new ClassSizeService(graphManager.classInfo);
      this.weightServices['class memory'] = classSizeService;
      this.weightServices['graph memory'] = new GraphSizeService(graphManager, classSizeService);
    }
  }

  getWeightServiceNames(): Array<string> {
    return Object.keys(this.weightServices).sort();
  }

  getWeightService(): WeightService {
    return this.weightService;
  }

  selectWeightService(weight: string) {
    this.weightService = this.weightServices[weight];
  }
}