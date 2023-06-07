#!/bin/bash

# Get the current date
date=$(date +"%Y%m%d-%H%M")

# Create the new line
line="$date $@"

# Add the new line to the file
echo "$line" >> work.log

# Notify the user that the line was added successfully
echo "Line added successfully!"
