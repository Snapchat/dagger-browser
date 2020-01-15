/**
 * Provides all of the route helpers
 */
export class Paths {
  static Home = "/:component?"
  static Component = "/:component"
  static Module = "/module/:module"
  static GraphModule = "/:component/module/:module"
  static GraphScope = "/:component/scope/:scope"
  static GraphNode = "/:component/node/:node"
  static GraphClosure = "/:component/closure/:key"
  static SubComponent = "/:component/:subcomponent"
}

export class Routes {
  static Home = "/"
  static Component = (component: string): string => {
    return `/${encodeURIComponent(component)}`;
  }
  static Module = (module: string): string => {
    return `/module/${encodeURIComponent(module)}`;
  }
  static GraphNode = (component: string, node: string): string => {
    return `/${encodeURIComponent(component)}/node/${encodeURIComponent(node)}`;
  }
  static GraphModule = (component: string, module: string): string => {
    return `/${encodeURIComponent(component)}/module/${encodeURIComponent(module)}`;
  }
  static GraphScope = (component: string, scope: string): string => {
    return `/${encodeURIComponent(component)}/scope/${encodeURIComponent(scope)}`;
  }
  static GraphClosure = (component: string, key: string): string => {
    return `/${encodeURIComponent(component)}/closure/${encodeURIComponent(key)}`;
  }

  static SubComponent = (component: string, subcomponent: string): string => {
    return `/${encodeURIComponent(component)}/${encodeURIComponent(subcomponent)}`;
  }
}

export default Routes;