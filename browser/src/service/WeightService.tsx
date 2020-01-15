import { Weight } from "../models/Graph";

/** Interface for getting the weight per graph node. */
export default interface WeightService {
  getWeight(componentName: string, node?: string): Weight | undefined;
}