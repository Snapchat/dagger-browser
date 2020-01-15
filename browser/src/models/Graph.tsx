/**
 * Defines the graph types
 */

export type ComponentSet = {
  components: Component[];
};

export type Component = {
  name: string;
  nodes: Node[];
};

export type Node = {
  key: string;
  scope?: string;
  module?: string;
  component?: string;
  kind: string;
  dependencies: Node[];
};

export type Module = {
  key: string;
  bindings: Node[];
}

export type Scope = {
  scope: string;
  bindings: Node[];
}

export type Weight = {
  value: number;

  /** Threshold for considering this a large value, useful for color highlighting. */
  largeThreshold: number;
  /** Threshold for considering this a small value, useful for color highlighting. */
  smallThreshold: number;

  /** A summary intended for title or alt attributes to show a breakdown or other details */
  summary?: string;

  /** Unit for the value. */
  unit?: string;
}

export default ComponentSet;
