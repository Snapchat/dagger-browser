#!/bin/bash
# Initializes the dagger browser given the build directory of project of where to search for component graph files.
# If the build directory is not provided, the sample will be compiled and used an example.
# Usage: ./init.sh [build_dir]

set -eu

MANIFEST_FILENAME=ComponentsManifest.json
CLASSINFO_FILENAME=ClassInfo.json

main() {
    local build_dir=${1:-}

    # if component manifest is not provided, then we build the sample
    if [ -z ${build_dir:-} ]; then
        echo "Build directory is not provided. Compiling the sample..."
        pushd plugin
        ./gradlew assemble
        popd
        build_dir=plugin/sample/build
    fi

    echo "Looking for component graph files in $build_dir"

    local components_manifest_file="build/ComponentsManifest.json"
    mkdir -p build
    local tmp="${components_manifest_file}.tmp"
    find $build_dir -path '*/build/*_graph.json' >"$tmp"
    echo '{"components": [' >|"$components_manifest_file"
    for f in $(awk "NR != $(wc -l <$tmp)" $tmp); do
        cat "$f" >>"$components_manifest_file"
        echo ',' >>"$components_manifest_file"
    done
    f=$(tail -n 1 "$tmp")

    if [ -z "$f" ]; then
        echo "Failed to find any component graph files in $build_dir. Did you add the SPI plugin to your modules?"
        exit 1
    fi

    cat "$f" >>"$components_manifest_file"
    echo ']}' >>"$components_manifest_file"
    
    # clean up the tmp file
    rm -f -- "$tmp"

    # Copy the manifest 
    cp -fR $components_manifest_file browser/public/$MANIFEST_FILENAME

    # TODO: Generate the class info file
    local class_info_file="build/ClassInfo.json"
    echo '{}' >|"$class_info_file"

    # Copy it to the right location
    cp -fR $class_info_file browser/public/$CLASSINFO_FILENAME


    # Install dependencies
    echo "Checking for any updated dependenecies..."
    pushd browser
    npm install
    popd
    echo "Init completed."
}

main $@