import { Weight } from "./Graph";

// TODO: Fix export error when this is exported from GraphManager
export default interface GraphReducer {
  reduce(key: string): void;
  result(): Weight;
}
