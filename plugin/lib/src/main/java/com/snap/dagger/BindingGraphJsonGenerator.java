package com.snap.dagger;

import java.io.IOException;
import java.io.PrintWriter;
import java.net.URI;
import java.util.Iterator;
import java.util.Set;

import javax.annotation.processing.Filer;
import javax.lang.model.element.TypeElement;
import javax.tools.FileObject;
import javax.tools.StandardLocation;

import com.google.common.base.Joiner;

import com.squareup.javapoet.ClassName;
import dagger.model.Binding;
import dagger.model.BindingGraph;
import dagger.model.BindingGraph.ComponentNode;
import dagger.model.BindingGraph.Node;
import dagger.model.DependencyRequest;
import dagger.spi.BindingGraphPlugin;
import dagger.spi.DiagnosticReporter;

/**
 * Plugin for dumping a JSON file that describes the dagger graph for every component.
 */
public class BindingGraphJsonGenerator implements BindingGraphPlugin {

    private Filer filter;

    @Override
    public void initFiler(Filer filer) {
        this.filter = filer;
    }

    @Override
    public void visitGraph(BindingGraph bindingGraph, DiagnosticReporter diagnosticReporter) {
        TypeElement componentElement = bindingGraph.rootComponentNode().componentPath().currentComponent();
        ClassName componentName = ClassName.get(componentElement);
        URI filePath = null;
        try {
            FileObject file = filter.createResource(StandardLocation.CLASS_OUTPUT,
                    componentName.packageName(),
                    Joiner.on('_').join(componentName.simpleNames()) + "_graph.json",
                    componentElement);

            try (PrintWriter writer = new PrintWriter(file.openWriter())) {
                writeComponentJson(bindingGraph, writer);
            }

        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private void writeComponentJson(BindingGraph bindingGraph, PrintWriter writer) {
        TypeElement rootComponentElement = bindingGraph.rootComponentNode().componentPath().currentComponent();
        ClassName rootComponentName = ClassName.get(rootComponentElement);
        writer.println("{");
        writer.println("    \"name\": \"" + rootComponentName + "\",");
        writer.println("    \"nodes\": [");

        Iterator<BindingGraph.Node> nodes = bindingGraph.network().nodes().iterator();
        while (nodes.hasNext()) {
            Node node = nodes.next();
            if (node instanceof Binding) {
                Binding binding = (Binding)node;
                // begin binding
                writer.println("        {");
                writer.println("            \"key\": \"" + escape(binding.key().toString()) + "\",");
                writer.println("            \"kind\": \"" + binding.kind() + "\",");
                writer.println("            \"component\": \"" + binding.componentPath().currentComponent() + "\",");

                if (binding.contributingModule().isPresent()) {
                    TypeElement e = binding.contributingModule().get();
                    writer.println("            \"module\": \"" + escape(e.toString()) + "\",");
                }

                if (binding.scope().isPresent()) {
                    writer.println("            \"scope\": \"" + binding.scope().get().scopeAnnotation() + "\",");
                }

                printDependencies(writer, binding.dependencies());

                // end binding
                writer.print("        }");
                if (nodes.hasNext()) {
                    writer.println(',');
                } else {
                    writer.println();
                }
            } else if (node instanceof ComponentNode) {
                // begin component
                ComponentNode componentNode = (ComponentNode) node;
                writer.println("        {");
                writer.println("            \"key\": \"" + componentNode.componentPath().currentComponent()+ "\",");
                if (!componentNode.componentPath().atRoot()) {
                    writer.println("            \"component\": \"" + componentNode.componentPath()
                            .rootComponent() + "\",");
                }
                writer.println("            \"subcomponent\": \"" + componentNode.isSubcomponent()+ "\",");
                writer.println("            \"related_components\": \"" + componentNode.componentPath().components()+ "\",");

                if (!componentNode.scopes().isEmpty()) {
                    writer.println("            \"scopes\": \"" + componentNode.scopes() + "\",");
                }

                printDependencies(writer, componentNode.entryPoints());

                // end component
                writer.print("        }");
                if (nodes.hasNext()) {
                    writer.println(',');
                } else {
                    writer.println();
                }
            }
        }
        writer.println("    ]");

        writer.println("}");
    }

    /**
     * Adds {@link DependencyRequest} to the writer
     */
    private void printDependencies(PrintWriter writer, Set<DependencyRequest> dependencyRequests) {
        // begin dependencies
        writer.println("            \"dependencies\": [");
        Iterator<DependencyRequest> dependencies = dependencyRequests.iterator();
        while (dependencies.hasNext()) {
            DependencyRequest dependencyRequest = dependencies.next();
            writer.println("                {");
            writer.println("                \"key\": \"" + escape(dependencyRequest.key().toString()) + "\",");
            writer.println("                \"kind\": \"" + dependencyRequest.kind() + "\",");
            if (dependencyRequest.requestElement().isPresent()) {
                writer.println("                \"element\": \"" +
                        dependencyRequest.requestElement().get() + "\"");
            } else {
                writer.println("                \"element\": null");
            }
            writer.print("                }");
            if (dependencies.hasNext()) {
                writer.println(',');
            } else {
                writer.println();
            }
        }
        // end dependencies
        writer.println("            ]");
    }

    private String escape(String string) {
        return string.replace("\"", "\\\"");
    }
}