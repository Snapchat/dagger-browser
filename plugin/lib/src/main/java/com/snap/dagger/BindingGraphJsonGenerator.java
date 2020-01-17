package com.snap.dagger;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import javax.annotation.processing.Filer;
import javax.lang.model.element.TypeElement;
import javax.tools.FileObject;
import javax.tools.StandardLocation;

import com.google.common.base.Joiner;

import com.squareup.javapoet.ClassName;
import com.squareup.moshi.JsonAdapter;
import com.squareup.moshi.Moshi;
import com.squareup.moshi.kotlin.reflect.KotlinJsonAdapterFactory;

import dagger.model.Binding;
import dagger.model.BindingGraph;
import dagger.model.BindingGraph.ComponentNode;
import dagger.spi.BindingGraphPlugin;
import dagger.spi.DiagnosticReporter;

/**
 * Dagger SPI plugin that generates a json file for each component in the graph.
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
        try {
            FileObject file = filter.createResource(StandardLocation.CLASS_OUTPUT,
                    componentName.packageName(),
                    Joiner.on('_').join(componentName.simpleNames()) + "_graph.json",
                    componentElement);

            DaggerGraph model = buildComponentModel(bindingGraph);
            Moshi moshi = new Moshi.Builder()
                    .add(DaggerNode.class, new DaggerNodeAdapter())
                    .add(new KotlinJsonAdapterFactory())
                    .build();
            JsonAdapter<DaggerGraph> adapter = moshi
                    .adapter(DaggerGraph.class)
                    .indent("    ");

            try (PrintWriter writer = new PrintWriter(file.openWriter())) {
                writer.print(adapter.toJson(model));
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private DaggerGraph buildComponentModel(BindingGraph bindingGraph) {
        TypeElement rootComponentElement = bindingGraph.rootComponentNode().componentPath().currentComponent();
        String rootComponentName = ClassName.get(rootComponentElement).toString();
        return new DaggerGraph(
                rootComponentName,
                getGraphNodes(bindingGraph)
        );
    }

    private List<? extends DaggerNode> getGraphNodes(BindingGraph bindingGraph) {
        return bindingGraph
                .network()
                .nodes()
                .stream()
                .map(node -> {
                    if (node instanceof Binding) {
                        Binding binding = (Binding)node;
                        return new DaggerBinding(
                                binding.key().toString(),
                                binding.kind().toString(),
                                binding.componentPath().currentComponent().toString(),
                                binding.contributingModule().isPresent() ?
                                        binding.contributingModule().get().toString() : null,
                                binding.scope().isPresent() ?
                                        binding.scope().get().scopeAnnotation().toString() : null,
                                binding.dependencies()
                                        .stream()
                                        .map(d -> new DaggerDependencyRequest(
                                                d.key().toString(),
                                                d.kind().toString(),
                                                d.requestElement().isPresent() ?
                                                        d.requestElement().toString() : null
                                                )
                                        ).collect(Collectors.toList())
                        );
                    } else if (node instanceof ComponentNode) {
                        ComponentNode componentNode = (ComponentNode)node;
                        return new DaggerComponent(
                                componentNode.componentPath().currentComponent().toString(),
                                componentNode.componentPath().atRoot() ? null :
                                        componentNode.componentPath().rootComponent().toString(),
                                componentNode.isSubcomponent(),
                                componentNode.componentPath()
                                        .components()
                                        .stream()
                                        .map(TypeElement::toString)
                                        .collect(Collectors.toList()),
                                componentNode.scopes().isEmpty() ? null :
                                        componentNode
                                                .scopes()
                                                .stream()
                                                .map(scope -> scope.scopeAnnotation().toString())
                                                .collect(Collectors.toList()),
                                componentNode.entryPoints()
                                        .stream()
                                        .map(d -> new DaggerDependencyRequest(
                                                        d.key().toString(),
                                                        d.kind().toString(),
                                                        d.requestElement().isPresent() ?
                                                                d.requestElement().toString() : null
                                                )
                                        ).collect(Collectors.toList())
                        );
                    } else {
                        return null;
                    }
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }
}