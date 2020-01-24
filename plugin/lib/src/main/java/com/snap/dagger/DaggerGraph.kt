package com.snap.dagger

import com.squareup.moshi.JsonAdapter
import com.squareup.moshi.JsonReader
import com.squareup.moshi.JsonWriter
import com.squareup.moshi.Moshi
import com.squareup.moshi.kotlin.reflect.KotlinJsonAdapterFactory

/**
 * Serializable data model for Dagger's BindingGraph.
 */
data class DaggerGraph(
    val name: String,
    val nodes: List<DaggerNode>
)

data class DaggerComponent(
    val key: String,
    val component: String?,
    val subcomponent: Boolean,
    val component_path: List<String>,
    val scopes: List<String>?,
    val dependencies: List<DaggerDependencyRequest>
) : DaggerNode()

data class DaggerBinding(
    val key: String,
    val kind: String,
    val component: String,
    val module: String?,
    val scope: String?,
    val dependencies: List<DaggerDependencyRequest>,
    val adjacentNodes: List<String>?
) : DaggerNode()

sealed class DaggerNode

data class DaggerDependencyRequest(
    val key: String,
    val kind: String,
    val element: String?
)

class DaggerNodeAdapter : JsonAdapter<DaggerNode>() {
    val moshi = Moshi.Builder().add(KotlinJsonAdapterFactory()).build()
    val bindingAdapter = moshi.adapter<DaggerBinding>(DaggerBinding::class.java)
    val componentAdapter = moshi.adapter<DaggerComponent>(DaggerComponent::class.java)

    override fun toJson(writer: JsonWriter, value: DaggerNode?) {
        return when (value) {
            is DaggerBinding -> bindingAdapter.toJson(writer, value)
            is DaggerComponent -> componentAdapter.toJson(writer, value)
            null -> return
        }
    }

    override fun fromJson(reader: JsonReader): DaggerNode? {
        throw UnsupportedOperationException()
    }
}
