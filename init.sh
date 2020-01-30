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

    # Build ComponentstManifest.json
    ./scripts/mkmanifest.sh $build_dir  browser/public/$MANIFEST_FILENAME
 
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

    echo "Init completed. Run a Browser:"
    echo "    cd browser; npm run start"
}

main $@