import GraphReducer from "./GraphReducer";
import ComponentSet, { Node, Component, Module, Scope, Weight } from "./Graph";
import axios from "axios";
import { ClassInfo } from "./ClassSize";
import Config from "./Config";

export const ALL_COMPONENTS = "";

export type GraphMatchResult = { node: Node; componentName: string };

const SUBCOMPONENT_LARGE_THRESHOLD = 500;
const SUBCOMPONENT_SMALL_THRESHOLD = 10;

/**
 * Wrapper to load the graph
 */
export default class GraphManager {
  manifestUrl?: string;
  classInfoUrl?: string;

  componentSet: ComponentSet = { components: [] };
  classInfo?: { [key: string]: ClassInfo };

  // Caches to speed up graph-based operations
  private nodeMap: { [componentName: string]: { [key: string]: Node } } = {};
  private componentMap: { [componentName: string]: Component } = {};
  private subcomponentWeights: { [key: string]: Weight }  = {};
  private callsitesMap: {
    [componentName: string]: { [key: string]: Node[] };
  } = {};

  async load(manifestUrl: string): Promise<boolean> {
    let classInfoUrl = manifestUrl.substring(0, manifestUrl.lastIndexOf("\/") + 1) + "ClassInfo.json";    

    try {
      let classInfoResponse = await axios.get(classInfoUrl);
      this.classInfo = classInfoResponse.data as { [key: string]: ClassInfo };
    } catch {
      // classInfo is optional
    }
    try {
      let manifestResponse = await axios.get(manifestUrl)      
      this.componentSet = manifestResponse.data as ComponentSet;
      this.populateCaches();
    } catch {
      return false;
    }

    this.manifestUrl = manifestUrl;
    this.classInfoUrl = classInfoUrl;
    return true;
  }

  getMatches(
    componentName: string | undefined,
    query: string,
    max: number,
    strictMatch: boolean
  ): GraphMatchResult[] {
    const components = componentName
      ? [this.getComponent(componentName)]
      : this.componentSet.components;

    let matches = [];

    for (const component of components) {
      for (const node of component.nodes) {

        if (strictMatch) {
          if (node.key.toLowerCase() == query.toLowerCase()) {
            matches.push({ node, componentName: component.name });
          }
        } else if (node.key.toLowerCase().includes(query.toLowerCase())) {
          matches.push({ node, componentName: component.name });
        }

        if (matches.length >= max) {
            return matches;
        }
      }
    }

    return matches;
  }

  getComponent(componentName: string): Component {
    const component = this.componentMap[componentName];

    if (!component) {
      throw Error(`Could not find ${componentName} component`);
    }

    return component;
  }

  getNode(component: string | undefined, node: string): Node | undefined {
    return this.nodeMap[component ? component : ALL_COMPONENTS][node];
  }

  getModule(component: string, moduleName: string): Module {
    const nodes = Object.values(this.nodeMap[component]).filter((node: Node) => {
      return node.module === moduleName;
    });

    return {
      key: moduleName,
      bindings: nodes
    };
  }

  getScope(component: string, scope: string): Scope {
    const nodes = Object.values(this.nodeMap[component]).filter((node: Node) => {
      return node.scope === scope;
    });

    return {
      scope: scope,
      bindings: nodes
    };
  }

  getCallsites(componentName: string, node: string): Node[] {
    return (this.callsitesMap[componentName][node] || []).map((binding: Node) => {
      const reference = this.getNode(componentName, binding.key);
      if (!reference) {
        return binding;
      }

      const referenceNode = reference.dependencies.find(d => d.key === node);

      if (!referenceNode) {
        return binding;
      }

      return {
        ...binding,
        kind: referenceNode.kind
      };
    });
  }

  getSubcomponentWeight(subcomponent: string): Weight {
    return this.subcomponentWeights[subcomponent];
  }

  getSubcomponentBindings(component: string, subcomponent: string): Node[] {
    return Object.values(this.nodeMap[component]).filter((node: Node) => {
      return node.component === subcomponent
    });
  }

  computeNodeWeight(componentName: string, key: string, graphReducer: GraphReducer): Weight {
    const node = this.getNode(componentName, key);
    if (node) {
      return this.computeWeightForNodes(componentName, [node], graphReducer);
    }
    return graphReducer.result();
  }

  /** Computes weight for a list of nodes, aggregating and returning result from graph reducer. */
  computeWeightForNodes(componentName: string, queue: Node[], graphReducer: GraphReducer): Weight {
    const visited: { [key: string]: boolean } = {};
    while (queue.length) {
      const queueNode = queue.shift();

      // TODO: This can be undefined due to bad shouldSkipNode logic
      if (!queueNode) {
        continue;
      }

      graphReducer.reduce(queueNode.key);
      visited[queueNode.key] = true;

      for (const dependency of queueNode.dependencies) {
        if (visited[dependency.key]) {
          continue;
        } else if (this.shouldSkipWeight(componentName, dependency.key)) {
          visited[dependency.key] = true;
          continue;
        }

        graphReducer.reduce(dependency.key);

        const node = this.getNode(componentName, dependency.key);
        if (node) {
          queue.push(node);
        }
        visited[dependency.key] = true;
      }
    }

    return graphReducer.result();
  }

  private shouldSkipWeight(componentName: string, dependencyKey: string): boolean | undefined {
    const bindingInComponent = this.getNode(componentName, dependencyKey);
    return (
      bindingInComponent && bindingInComponent.kind === "MEMBERS_INJECTION"
    );
  }

  private populateCaches() {
    // Store all nodes under `ALL_COMPONENTS` key for universal search
    this.nodeMap[ALL_COMPONENTS] = {};
    this.callsitesMap[ALL_COMPONENTS] = {};

    // traverse the components
    for (const component of this.componentSet.components) {
      this.nodeMap[component.name] = {};
      this.callsitesMap[component.name] = {};
      this.componentMap[component.name] = component;

      // TODO: should avoid modifying the components
      component.nodes = component.nodes.filter(node => !this.shouldSkipNode(node));

      for (const node of component.nodes) {
        this.nodeMap[component.name][node.key] = node;
        this.nodeMap[ALL_COMPONENTS][node.key] = node;

        // populate subcomponent weight
        if (node.component && node.component != component.name) {
          let subcomponent = node.component;
          if (!this.subcomponentWeights[subcomponent]) {
            this.subcomponentWeights[subcomponent] = {
              value: 0,
              smallThreshold: SUBCOMPONENT_SMALL_THRESHOLD,
              largeThreshold: SUBCOMPONENT_LARGE_THRESHOLD
            } as Weight;
          }
          this.subcomponentWeights[subcomponent].value++;
        }

        for (const dep of node.dependencies) {
          if (!this.callsitesMap[component.name][dep.key]) {
            this.callsitesMap[component.name][dep.key] = [];
          }
          if (!this.callsitesMap[ALL_COMPONENTS][dep.key]) {
            this.callsitesMap[ALL_COMPONENTS][dep.key] = [];
          }

          this.callsitesMap[component.name][dep.key].push(node);
          this.callsitesMap[ALL_COMPONENTS][dep.key].push(node);
        }
      }
    }
  }

  private shouldSkipNode(node: Node): boolean {
    return node.kind === "BOUND_INSTANCE";
  }
}
