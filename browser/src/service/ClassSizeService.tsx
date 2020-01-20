import ClassSize, { ClassInfo } from "../models/ClassSize";
import { Weight } from "../models/Graph";
import WeightService from "./WeightService";

const LARGE_THRESHOLD_KB = 20; // Nodes over 10KB are considered "large"
const SMALL_THRESHOLD_KB = 3; // Nodes less than 3KB are considered "small"

/**
 * Service to get class size for a given class name.
 */
export default class ClassSizeService implements WeightService {
  /** Class information - method/field count and dex size - stored per fully qualified class name. */
  classInfo: { [key: string]: ClassInfo };

  constructor(classInfo: { [key: string]: ClassInfo }) {
    this.classInfo = classInfo;
  }

  getWeight(componentName: string, node?: string): Weight | undefined {
    const classSize = node ? this.getClassSize(node) : 0;
    if (classSize) {
      var memorySizeKb = classSize.getMemorySize() / 1024;
      if (memorySizeKb > 1) {
        memorySizeKb = Math.round(memorySizeKb);
      }

      return {
        value: memorySizeKb,
        largeThreshold: LARGE_THRESHOLD_KB,
        smallThreshold: SMALL_THRESHOLD_KB,
        summary: classSize.getSummary(),
        unit: 'kB'
      } as Weight;
    }
  }

  getClassSize(className: string): ClassSize | undefined {
    const info = this.classInfo[className];
    if (info) {
      return new ClassSize(info);
    }
  }
}
