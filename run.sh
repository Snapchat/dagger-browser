#!/bin/bash
# Initializes and runs the dagger browser given the build directory of project of where to search for
# component graph files. If the build directory is not provided, the sample will be compiled and used an example.
# Usage: ./run.sh [build_dir]

./init.sh $@

cd browser && npm run start
