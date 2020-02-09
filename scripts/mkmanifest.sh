#!/bin/bash
# Initializes the dagger browser given the build directory of project of where to search for component graph files.
# If the build directory is not provided, the sample will be compiled and used an example.
# Usage: ./init.sh build_dir [out_file]

set -eu

MANIFEST_FILENAME=ComponentsManifest.json

main() {
    local build_dir=${1:-}
    local out_file=${2:-}

    # if component manifest is not provided, then we build the sample
    if [ -z ${build_dir:-} ]; then
        echo "Usage: $0 build_dir"
        exit 1
    fi

    if [ -d "$out_file" ]; then
        out_file="${out_file}/${MANIFEST_FILENAME}"
    elif [ -z ${out_file:-} ]; then
        out_file="$MANIFEST_FILENAME"
    fi

    echo "Looking for component graph files in $build_dir"

    local components_manifest_file=$out_file
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

    echo ""
    echo "Generated $out_file"
    echo ""
}

main $@